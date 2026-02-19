import { _decorator, Component, Prefab, instantiate, Node, UITransform, SpriteFrame, tween, view } from 'cc';
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

    private boardPadding: number = 20;   // space from board edge
    private cardSpacing: number = 20;    // space between cards

    private flippedQueue: Card[] = [];

    start() {
       this.scheduleOnce(() => {
        this.generateBoard();
    }, 0);
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

        // Keep aspect ratio
        const uniformScale = Math.min(cellWidth / 200, cellHeight / 300);

        // Final card size
        const finalCardWidth = 200 * uniformScale;
        const finalCardHeight = 300 * uniformScale;

        const gridWidth = cols * finalCardWidth + totalSpacingX;
        const gridHeight = rows * finalCardHeight + totalSpacingY;

        const startX = -gridWidth / 2 + finalCardWidth / 2;
        const startY = gridHeight / 2 - finalCardHeight / 2;

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

            const x = startX + col * (finalCardWidth + this.cardSpacing);
            const y = startY - row * (finalCardHeight + this.cardSpacing);

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

    public onCardFlipped(card: Card): void {
        // Add card to queue
        this.flippedQueue.push(card);

        // If at least 2 cards, resolve next pair
        if (this.flippedQueue.length >= 2) {

            const cardA = this.flippedQueue.shift();
            const cardB = this.flippedQueue.shift();

            this.resolvePair(cardA!, cardB!);
        }
    }

    private resolvePair(cardA: Card, cardB: Card): void {

    const modelA = cardA.getModel();
    const modelB = cardB.getModel();

        if (modelA.id === modelB.id) {
            // Match found
            modelA.isMatched = true;
            modelB.isMatched = true;
            cardA.onCardMatched();
            cardB.onCardMatched();

        } else {

            // Mismatch — schedule flip back
            this.scheduleOnce(() => {
                cardA.flip(false);
                cardB.flip(false);
            }, 0.7);
        }
    }

    shuffle(array: number[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
