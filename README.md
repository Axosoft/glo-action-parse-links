# GitHub action to parse links to Glo Boards cards

Use this action to parse out [Glo Boards](https://www.gitkraken.com/glo) card IDs from links in git commit message or pull request description.
The action returns an output that is a stringified list of boards and cards.

## Using Glo Boards card links
A common scenario in development workflows is to add links to issues or Glo cards in commit messages and pull request descriptions.
```md
Fixed this issue https://app.gitkraken.com/glo/board/yTpBhWt5sAAPpbTs/card/XTpBhVr8GQAQzaCa
Works fine on my machine
```

When including links to Glo Boards cards in a commit message, you can use this GitHub action to parse those links
to retrieve the IDs of the boards and cards referenced in the links.
The board ID and card ID can then be used in subsequent steps to perform actions on these cards
(e.g. change the label or assignee, or move the cards to another column).

## Action output
This action has an output parameter called `cards` which is an array of objects with the following interface:
```ts
interface ICard {
  boardId: string;
  cardId: string;
}
```
where `boardId` is the ID of the board, and `cardId` is the ID of a card belonging to that board.

The `cards` output is stringified, so in order to use it in another action it just needs to be parsed:
```ts
const cardsJson = core.getInput('cards');
const cards = JSON.parse(cardsJson);
```

## Usage with another action
Add a step in your workflow file to perform to parse the links, then a second step can use the output from this action:
```yaml
    steps:
    - uses: Axosoft/glo-action-parse-links@v1
      id: glo-parse

    - uses: Axosoft/glo-action-label-card@v1
      with:
        authToken: ${{ secrets.GLO-PAT }}
        cards: '${{ steps.glo-parse.outputs.cards }}'
        label: 'Released'
      id: glo-label
```
