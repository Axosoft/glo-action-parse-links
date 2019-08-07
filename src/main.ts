import * as fs from 'fs';
import * as core from '@actions/core';
import {toHex} from 'base64-mongo-id';

interface ICard {
  boardId: string;
  cardId: string;
}

function formatResponse(response: ICard[]) {
  return core.setOutput('cards', JSON.stringify(response));
}

async function run() {
  const isPush = process.env.GITHUB_EVENT_NAME === 'push';
  const isPullRequest = process.env.GITHUB_EVENT_NAME === 'pull_request';
  if (!isPush && !isPullRequest) {
    return formatResponse([]);
  }

  // read event file
  const event: any = JSON.parse(
    fs.readFileSync(process.env.GITHUB_EVENT_PATH as string, {encoding: 'utf8'})
  );

  let bodyToSearchForGloLink;
  if (isPush) {
    if (!event || !event.head_commit || !event.head_commit.message) {
      return formatResponse([]);
    }
    bodyToSearchForGloLink = event.head_commit.message;
  }

  if (isPullRequest) {
    if (!event || !event.pull_request || !event.pull_request.body) {
      return formatResponse([]);
    }
    bodyToSearchForGloLink = event.pull_request.body;
  }

  const urlREGEX = RegExp(
    `https://app.gitkraken.com/glo/board/([\\w.-]+)/card/([\\w.-]+)`,
    'g'
  );
  const cards: ICard[] = [];

  let foundResult;
  while ((foundResult = urlREGEX.exec(bodyToSearchForGloLink)) !== null) {
    if (!foundResult || foundResult.length < 3) {
      // link is not valid??
      return;
    }
    // 0 https://app.gitkraken.com/glo/board/WypkcIjPCxAArrhR/card/XKTgt5arBgAPsVjF
    const boardId = toHex(foundResult[1]);
    const cardId = toHex(foundResult[2]);

    cards.push({
      boardId,
      cardId
    });
  }

  return formatResponse(cards);
}

run();
