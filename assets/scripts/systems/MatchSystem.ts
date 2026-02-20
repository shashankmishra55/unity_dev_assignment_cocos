import { Card } from "../board/Card";


export class MatchSystem {

    constructor(
        private onMatch: () => void,
        private onTurn: () => void
    ) {}

    public resolvePair(cardA: Card, cardB: Card, scheduleFlipBack: (a: Card, b: Card) => void) {

        this.onTurn();

        const modelA = cardA.getModel();
        const modelB = cardB.getModel();

        if (modelA.id === modelB.id) {

            modelA.isMatched = true;
            modelB.isMatched = true;

            cardA.onCardMatched();
            cardB.onCardMatched();

            this.onMatch();

        } else {
            scheduleFlipBack(cardA, cardB);
        }
    }
}
