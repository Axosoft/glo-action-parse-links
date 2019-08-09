import { getCardsFromLinks } from '../src/action';

const PR_MESSAGE_1 = 'Some pull request message \r with pull request issues\r';
const GLO_CARD_LINK_1 = 'https://app.gitkraken.com/glo/board/XUyFBZ_0OgAP5ACH/card/XUyVoiumEQAP8tIY \r';
const GLO_CARD_LINK_2 = 'https://app.gitkraken.com/glo/board/XUyFBZ_0OgAP5ACH/card/XUyVsGR-2QAPHLHz \r';
const ISSUE_LINK_1 = 'https://github.com/DiUS/pact-workshop-js/issues/7 \r';

describe('Action', () => {
  describe('getCardsFromLinks', () => {
    it('should return empty array if no links in body', async () => {
      const body = PR_MESSAGE_1;

      const cards = getCardsFromLinks(body);
      expect(cards).not.toBeNull();
      expect(cards.length).toBe(0);
    });

    it('should return cards array when there is a link', async () => {
      const body = PR_MESSAGE_1 + ISSUE_LINK_1 + GLO_CARD_LINK_1;

      const cards = getCardsFromLinks(body);
      expect(cards).not.toBeNull();
      expect(cards.length).toBe(1);
      expect(cards[0].cardId).toBe('5d4c95a22ba611000ff2d218');
    });

    it('should return cards array when there are multiple links', async () => {
      const body = PR_MESSAGE_1 + ISSUE_LINK_1 + GLO_CARD_LINK_1 + ISSUE_LINK_1 + GLO_CARD_LINK_2 + PR_MESSAGE_1;

      const cards = getCardsFromLinks(body);
      expect(cards).not.toBeNull();
      expect(cards.length).toBe(2);
      expect(cards[0].cardId).toBe('5d4c95a22ba611000ff2d218');
      expect(cards[1].cardId).toBe('5d4c95b0647fd9000f1cb1f3');
    });
  });
});
