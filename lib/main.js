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
function formatResponse(response) {
    return core.setOutput('cards', JSON.stringify(response));
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const isPush = process.env.GITHUB_EVENT_NAME === 'push';
        const isPullRequest = process.env.GITHUB_EVENT_NAME === 'pull_request';
        if (!isPush && !isPullRequest) {
            return formatResponse([]);
        }
        // read event file
        const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
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
        const urlREGEX = RegExp(`https://app.gitkraken.com/glo/board/([\\w.-]+)/card/([\\w.-]+)`, 'g');
        const cards = [];
        let foundResult;
        while ((foundResult = urlREGEX.exec(bodyToSearchForGloLink)) !== null) {
            if (!foundResult || foundResult.length < 3) {
                // link is not valid??
                return;
            }
            // 0 https://app.gitkraken.com/glo/board/WypkcIjPCxAArrhR/card/XKTgt5arBgAPsVjF
            const boardId = base64_mongo_id_1.toHex(foundResult[1]);
            const cardId = base64_mongo_id_1.toHex(foundResult[2]);
            cards.push({
                boardId,
                cardId
            });
        }
        return formatResponse(cards);
    });
}
run();
