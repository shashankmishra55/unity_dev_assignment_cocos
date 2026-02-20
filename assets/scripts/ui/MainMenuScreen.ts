import { _decorator, instantiate, Prefab, Node, Label } from 'cc';
import { BaseScreen } from './BaseScreen';
import { ScreenManager } from './ScreenManager';
import { ScreenId } from './ScreenId';
import { LevelConfig, LEVELS } from '../configs/GameConfig';


const { ccclass, property } = _decorator;

@ccclass('MainMenuScreen')
export class MainMenuScreen extends BaseScreen {

    @property(Prefab)
    levelButtonPrefab: Prefab;

    @property(Node)
    levelContainer: Node; 


    protected onInit(): void {
        LEVELS.forEach(level => {
            const node = instantiate(this.levelButtonPrefab);
            node.setParent(this.levelContainer);
            node.children[0].getComponent(Label).string = `${level.rows}x${level.cols}`;
            node.on(Node.EventType.TOUCH_END, () => {
                this.onLevelSelected(level);
            });
        });

    }

    protected onShow(): void {
        
    }

    protected onHide(): void {
        
    }

    
    public onStartClicked(): void {
        ScreenManager.instance.open(ScreenId.GAME, 1);
    }

    onLevelSelected(level: LevelConfig): void {
        ScreenManager.instance.open(ScreenId.GAME, level);
    }

}
