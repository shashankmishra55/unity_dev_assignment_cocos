import { _decorator, Component, Prefab, instantiate, Node, UITransform, SpriteFrame, EventTarget } from 'cc';
import { Card } from '../board/Card';
import { ScoreSystem } from '../systems/ScoreSystem';
import { MatchSystem } from '../systems/MatchSystem';
import { CardModel } from '../board/CardModel';
import { LevelConfig } from '../configs/GameConfig';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Prefab)
    cardPrefab: Prefab = null;

    @property([SpriteFrame])
    cardSprites = [];

    @property(Node)
    board: Node = null;

    @property
    rows: number = 2;

    @property
    cols: number = 3;

    private flippedQueue: Card[] = [];

    private scoreSystem: ScoreSystem;
    private matchSystem: MatchSystem;
    public static events = new EventTarget();

    private boardPadding: number = 20;
    private cardSpacing: number = 20;

    private matchedPairs: number = 0;
    private totalPairs: number = 0;
    

    start() {

        this.scoreSystem = new ScoreSystem((data) => {
            GameManager.events.emit('GAME_UPDATED', data);
        });

        this.matchSystem = new MatchSystem(
            this.onMatchFound.bind(this),
            () => this.scoreSystem.addTurn()
        );
    }

    startGame(level: LevelConfig): void {
        console.log("Starting game with level config:", level);
        this.rows = level.rows;
        this.cols = level.cols;
        this.totalPairs = (this.rows * this.cols) / 2;
        this.generateBoard();
    }

    private generateBoard(): void {

        const boardSize = this.board.getComponent(UITransform)!.contentSize;

        const usableWidth = boardSize.width - this.boardPadding * 2;
        const usableHeight = boardSize.height - this.boardPadding * 2;

        const totalSpacingX = this.cardSpacing * (this.cols - 1);
        const totalSpacingY = this.cardSpacing * (this.rows - 1);

        const cellWidth = (usableWidth - totalSpacingX) / this.cols;
        const cellHeight = (usableHeight - totalSpacingY) / this.rows;

        const uniformScale = Math.min(cellWidth / 200, cellHeight / 300);

        const finalCardWidth = 200 * uniformScale;
        const finalCardHeight = 300 * uniformScale;

        const gridWidth = this.cols * finalCardWidth + totalSpacingX;
        const gridHeight = this.rows * finalCardHeight + totalSpacingY;

        const startX = -gridWidth / 2 + finalCardWidth / 2;
        const startY = gridHeight / 2 - finalCardHeight / 2;

        const totalCards = this.rows * this.cols;
        const ids: number[] = [];

        for (let i = 0; i < totalCards / 2; i++) {
            ids.push(i, i);
        }

        this.shuffle(ids);

        ids.forEach((id, index) => {

            const node = instantiate(this.cardPrefab);
            const card = node.getComponent(Card)!;

            const model = new CardModel(id);
            card.init(model, this.cardSprites[id]);

            node.setParent(this.board);

            const row = Math.floor(index / this.cols);
            const col = index % this.cols;

            const x = startX + col * (finalCardWidth + this.cardSpacing);
            const y = startY - row * (finalCardHeight + this.cardSpacing);

            node.setPosition(x, y);
            node.setScale(uniformScale, uniformScale, 1);

            node.on(Node.EventType.TOUCH_END, () => {
                card.onClick();
            });

            node.on("CARD_FLIPPED", this.onCardFlipped, this);
        });
    }

    public onCardFlipped(card: Card): void {

        this.flippedQueue.push(card);

        if (this.flippedQueue.length >= 2) {

            const cardA = this.flippedQueue.shift()!;
            const cardB = this.flippedQueue.shift()!;

            this.matchSystem.resolvePair(
                cardA,
                cardB,
                (a, b) => {
                    this.scheduleOnce(() => {
                        a.flip(false);
                        b.flip(false);
                    }, 0.7);
                }
            );
        }
    }

    private onMatchFound(){
        this.scoreSystem.addMatch();
        this.matchedPairs++;
        console.log("Match found!", "Total matched pairs:", this.matchedPairs, "Total pairs:", this.totalPairs);
        if (this.matchedPairs >= this.totalPairs) {
            GameManager.events.emit('GAME_COMPLETE', this.scoreSystem.getScore());
        }
    }

    private shuffle(array: number[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    public resetGame(): void {

        this.unscheduleAllCallbacks();
        this.flippedQueue.length = 0;
        this.board.children.forEach(child => {
            child.off(Node.EventType.TOUCH_END);
            child.off("CARD_FLIPPED");
        });
        this.board.removeAllChildren();
        this.scoreSystem?.reset();
        this.matchedPairs = 0;  
        this.totalPairs = 0;
}

}
