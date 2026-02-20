export class CardModel {

    id: number;
    isFlipped: boolean = false;
    isMatched: boolean = false;

    constructor(id: number) {
        this.id = id;
    }
}
