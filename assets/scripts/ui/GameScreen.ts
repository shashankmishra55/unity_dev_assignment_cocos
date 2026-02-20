import { _decorator, Label } from 'cc';
import { BaseScreen } from './BaseScreen';
import { ScreenManager } from './ScreenManager';
import { ScreenId } from './ScreenId';
import { GameManager } from '../core/GameManager';
import { LevelConfig, LEVELS } from '../configs/GameConfig';
import { GameOverPopup } from './GameOverPopup';

const { ccclass, property } = _decorator;

@ccclass('GameScreen')
export class GameScreen extends BaseScreen {

    @property(Label)
    matchCountLabel: Label = null;

    @property(Label)
    turnCountLabel: Label = null;

    @property(GameManager)
    private gameManager: GameManager = null!;

    @property(GameOverPopup)
    private gameOverPopup: GameOverPopup = null!;

    private currentLevelData: LevelConfig | null = null;


    protected onInit(): void {
        
    }
    
    protected onShow(levelData?: LevelConfig): void {
        GameManager.events.on('GAME_UPDATED', this.onGameUpdated, this);
        GameManager.events.on('GAME_COMPLETE', this.onGameComplete, this);
        this.currentLevelData = levelData || this.currentLevelData;
        this.startGame(levelData);
    }

    protected onHide(): void {
            this.resetGame();
            GameManager.events.off('GAME_UPDATED',this.onGameUpdated,this);
            GameManager.events.off('GAME_COMPLETE',this.onGameComplete,this);
    }

    private startGame(levelData: LevelConfig): void {
        this.gameManager.startGame(levelData);
    }

    
    private resetGame(): void {
            this.matchCountLabel.string = 'Matches: 0';
            this.turnCountLabel.string = 'Turns: 0';
            this.gameManager.resetGame();
            this.gameOverPopup.hide();
    }

    public onHomeClicked(): void {
        ScreenManager.instance.open(ScreenId.MAIN_MENU);
    }

    private onGameUpdated(data: any): void {
        this.matchCountLabel.string = `Matches: ${data.matches}`;
        this.turnCountLabel.string = `Turns: ${data.turns}`;
    }

    private onGameComplete(score: number): void {
        this.gameOverPopup.show(score);
    }

    onRetryButtonClicked() {
        this.resetGame();
        this.startGame(this.currentLevelData!);
    }

    onNextLevelButtonClicked() {
        this.resetGame();
        let nextLevelData = LEVELS.find(level => level.id === this.currentLevelData!.id + 1);
        console.log("Next level data:", nextLevelData);
        if (nextLevelData) {
            this.startGame(nextLevelData);
        } else {
            this.startGame(this.currentLevelData);
        }
        
    }
}
