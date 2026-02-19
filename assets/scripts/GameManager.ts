import { _decorator, Component, Prefab, instantiate, Node, UITransform, SpriteFrame } from 'cc';
import { Card } from './Card';
import { CardModel } from './CardModel';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Prefab)
    cardPrefab: Prefab = null;

    @property([SpriteFrame])
    cardSprites = [];

    @property(Node)
    board: Node = null;

    private firstCard: Card = null;
    private secondCard: Card = null;
    private isChecking = false;

    private boardPadding: number = 40;   // space from board edge
    private cardSpacing: number = 20;    // space between cards

    start() {
        this.generateBoard();
    }

    generateBoard() {

        const rows = 4;
        const cols = 4;

        const boardSize = this.board.getComponent(UITransform).contentSize;

        const usableWidth = boardSize.width - this.boardPadding * 2;
        const usableHeight = boardSize.height - this.boardPadding * 2;

        // Total spacing between cards
        const totalSpacingX = this.cardSpacing * (cols - 1);
        const totalSpacingY = this.cardSpacing * (rows - 1);

        // Raw cell size
        const cellWidth = (usableWidth - totalSpacingX) / cols;
        const cellHeight = (usableHeight - totalSpacingY) / rows;


        // Final card size
        const cardWidth = (usableWidth - totalSpacingX) / cols;
        const cardHeight = (usableHeight - totalSpacingY) / rows;

        // Keep aspect ratio
        const uniformScale = Math.min(cardWidth / 200, cardHeight / 300);

        const totalCards = rows * cols;
        const ids: number[] = [];

        for (let i = 0; i < totalCards / 2; i++) {
            ids.push(i, i);
        }

        this.shuffle(ids);

        ids.forEach((id, index) => {

            const node = instantiate(this.cardPrefab);
            const card = node.getComponent(Card);

            const model = new CardModel(id);
            card.init(model, this.cardSprites[id]);

            node.setParent(this.board);

            const row = Math.floor(index / cols);
            const col = index % cols;

            const startX = -usableWidth / 2 + cardWidth / 2 + this.boardPadding;
            const startY = usableHeight / 2 - cardHeight / 2 - this.boardPadding ;

            const x = startX + col * (cardWidth + this.cardSpacing);
            const y = startY - row * (cardHeight + this.cardSpacing);

            node.setParent(this.board);
            node.setPosition(x, y);
            node.setScale(uniformScale, uniformScale, 1);

            node.on(Node.EventType.TOUCH_END, () => {
                if (this.isChecking) return;
                card.onClick();
            });

            node.on("CARD_FLIPPED", this.onCardFlipped, this);
        });
    }

    onCardFlipped(card: Card, showFront) {
        if(!showFront) return; // Only consider when a card is flipped to show front
        if (!this.firstCard) {
            this.firstCard = card;
        } 
        else if (!this.secondCard && card !== this.firstCard) {
            this.secondCard = card;
            this.checkMatch();
        }
    }

    checkMatch() {

        this.isChecking = true;

        const modelA = this.firstCard.getModel();
        const modelB = this.secondCard.getModel();

        if (modelA.id === modelB.id) {

            modelA.isMatched = true;
            modelB.isMatched = true;

            this.resetTurn();

        } else {

            setTimeout(() => {
                this.firstCard.flip(false);
                this.secondCard.flip(false);
                this.resetTurn();
            }, 700);
        }
    }

    resetTurn() {
        this.firstCard = null;
        this.secondCard = null;
        this.isChecking = false;
    }

    shuffle(array: number[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
