import { _decorator, Label } from 'cc';
import { BaseScreen } from './BaseScreen';
import { ScreenManager } from './ScreenManager';
import { ScreenId } from './ScreenId';
import { GameManager } from '../core/GameManager';
import { LevelConfig } from './MainMenuScreen';

const { ccclass, property } = _decorator;

@ccclass('GameScreen')
export class GameScreen extends BaseScreen {

    @property(Label)
    matchCountLabel: Label = null;

    @property(Label)
    turnCountLabel: Label = null;

    @property(GameManager)
    private gameManager: GameManager = null!;


    protected onInit(): void {
        
    }
    
    protected onShow(levelData?: LevelConfig): void {
        GameManager.events.on('GAME_UPDATED', this.onGameUpdated, this);
        this.startGame(levelData);
    }

    protected onHide(): void {
            this.resetGame();
            GameManager.events.off('GAME_UPDATED',this.onGameUpdated,this);
    }

    private startGame(levelData: LevelConfig): void {
        this.gameManager.startGame(levelData);
    }

    
    private resetGame(): void {
            this.matchCountLabel.string = 'Matches: 0';
            this.turnCountLabel.string = 'Turns: 0';
            this.gameManager.resetGame();
    }

    public onHomeClicked(): void {
        ScreenManager.instance.open(ScreenId.MAIN_MENU);
    }

    private onGameUpdated(data: any): void {
        this.matchCountLabel.string = `Matches: ${data.matches}`;
        this.turnCountLabel.string = `Turns: ${data.turns}`;
    }
}
