import { _decorator, instantiate, Prefab, Node, Label } from 'cc';
import { BaseScreen } from './BaseScreen';
import { ScreenManager } from './ScreenManager';
import { ScreenId } from './ScreenId';

export interface LevelConfig {
    id: number;
    rows: number;
    cols: number;
}
const { ccclass, property } = _decorator;

@ccclass('MainMenuScreen')
export class MainMenuScreen extends BaseScreen {

    @property(Prefab)
    levelButtonPrefab: Prefab;

    @property(Node)
    levelContainer: Node; 
    
    private levels: LevelConfig[] = [
        { id: 1, rows: 2, cols: 6 },
        { id: 2, rows: 2, cols: 4 },
        { id: 3, rows: 3, cols: 4 },
        { id: 4, rows: 4, cols: 4 },
        { id: 5, rows: 4, cols: 5 },
        { id: 6, rows: 4, cols: 6 },
    ];


    protected onInit(): void {
        this.levels.forEach(level => {
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
