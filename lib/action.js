"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const core = __importStar(require("@actions/core"));
const base64_mongo_id_1 = require("base64-mongo-id");
function formatResponse(response, title = '', body = '') {
    core.setOutput('cards', JSON.stringify(response));
    core.setOutput("title", title);
    core.setOutput("body", body);
}
exports.getCardsFromLinks = (bodyToParse) => {
    const cards = [];
    const urlREGEX = RegExp(`https://app.gitkraken.com/glo/board/([\\w.-]+)/card/([\\w.-]+)`, 'g');
    let foundResult;
    while ((foundResult = urlREGEX.exec(bodyToParse)) !== null) {
        if (!foundResult || foundResult.length < 3) {
            // link is not valid??
            break;
        }
        // 0 https://app.gitkraken.com/glo/board/WypkcIjPCxAArrhR/card/XKTgt5arBgAPsVjF
        const boardId = base64_mongo_id_1.toHex(foundResult[1]);
        const cardId = base64_mongo_id_1.toHex(foundResult[2]);
        cards.push({
            boardId,
            cardId
        });
    }
    return cards;
};
exports.parseEvent = () => __awaiter(this, void 0, void 0, function* () {
    const isPush = process.env.GITHUB_EVENT_NAME === 'push';
    const isPullRequest = process.env.GITHUB_EVENT_NAME === 'pull_request';
    if (!isPush && !isPullRequest) {
        return formatResponse([]);
    }
    // read event file
    const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
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
    const cards = exports.getCardsFromLinks(bodyToSearchForGloLink);
    return formatResponse(cards, titleOfEvent, bodyToSearchForGloLink);
});
