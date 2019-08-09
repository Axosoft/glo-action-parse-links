import * as fs from 'fs';
import * as core from '@actions/core';
import {toHex} from 'base64-mongo-id';

interface ICard {
  boardId: string;
  cardId: string;
}

function formatResponse(response: ICard[], title: string = '', body: string = '') {
  core.setOutput('cards', JSON.stringify(response));
  core.setOutput("title", title);
  core.setOutput("body", body);
}

export const getCardsFromLinks = (bodyToParse: string): ICard[] => {
  const cards: ICard[] = [];
  const urlREGEX = RegExp(
    `https://app.gitkraken.com/glo/board/([\\w.-]+)/card/([\\w.-]+)`,
    'g'
  );

  let foundResult;
  while ((foundResult = urlREGEX.exec(bodyToParse)) !== null) {
    if (!foundResult || foundResult.length < 3) {
      // link is not valid??
      break;
    }
    // 0 https://app.gitkraken.com/glo/board/WypkcIjPCxAArrhR/card/XKTgt5arBgAPsVjF
    const boardId = toHex(foundResult[1]);
    const cardId = toHex(foundResult[2]);

    cards.push({
      boardId,
      cardId
    });
  }

  return cards;
}

export const parseEvent = async () => {
  const isPush = process.env.GITHUB_EVENT_NAME === 'push';
  const isPullRequest = process.env.GITHUB_EVENT_NAME === 'pull_request';
  if (!isPush && !isPullRequest) {
    return formatResponse([]);
  }

  // read event file
  const event: any = JSON.parse(
    fs.readFileSync(process.env.GITHUB_EVENT_PATH as string, {encoding: 'utf8'})
  );

  let bodyToSearchForGloLink = '';
  let titleOfEvent = '';
  if (isPush) {
    if (!event || !event.head_commit) {
      return formatResponse([]);
    }
    bodyToSearchForGloLink = event.head_commit.message;
    titleOfEvent = event.head_commit.id; // sha
  }

  if (isPullRequest) {
    if (!event || !event.pull_request) {
      return formatResponse([]);
    }
    bodyToSearchForGloLink = event.pull_request.body;
    titleOfEvent = event.pull_request.title;
  }

  if (!bodyToSearchForGloLink) {
    return formatResponse([], titleOfEvent); 
  }

  const cards = getCardsFromLinks(bodyToSearchForGloLink);

  return formatResponse(cards, titleOfEvent, bodyToSearchForGloLink);
}
