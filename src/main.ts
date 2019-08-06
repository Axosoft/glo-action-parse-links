import * as fs from 'fs';
import * as core from '@actions/core';
import { toHex } from 'base64-mongo-id';

interface IBoard {
  id: string;
  cards: string[];
}
function formatResponse(response: IBoard[]) {
  return core.setOutput("boards", JSON.stringify(response));;
}

async function run() {
  if (process.env.GITHUB_EVENT_NAME !== 'push') {
    return formatResponse([]);
  }

  // read event file
  const event: any = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH as string, { encoding: 'utf8' }));
  if (!event || !event.head_commit || !event.head_commit.message) {
    return formatResponse([]); 
  }

  let bodyToSearchForGloLink = event.head_commit.message;

  const urlREGEX = RegExp(`https://app.gitkraken.com/glo/board/([\\w.-]+)/card/([\\w.-]+)`, 'g');

  let boardIdIndexMap: { [boardId: string]: number } = {};
  let boards: IBoard[] = [];
  let foundResult;
  while ((foundResult = urlREGEX.exec(bodyToSearchForGloLink)) !== null) {
    if (!foundResult || foundResult.length < 3) {
      // link is not valid??
      return;
    }
    // 0 https://app.gitkraken.com/glo/board/WypkcIjPCxAArrhR/card/XKTgt5arBgAPsVjF
    const boardId = toHex(foundResult[1]);
    const cardId = toHex(foundResult[2]);

    boardIdIndexMap[boardId] = boardIdIndexMap[boardId] || boards.length;

    const board = boards[boardIdIndexMap[boardId]];
    if (board) {
      board.cards.push(cardId);
    } else {
      boards[boardIdIndexMap[boardId]] = {
        id: boardId,
        cards: [cardId]
      }
    }
  }

  return formatResponse(boards);
}

run();
