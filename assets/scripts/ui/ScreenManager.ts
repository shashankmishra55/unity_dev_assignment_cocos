import { _decorator, Component, Node } from 'cc';
import { BaseScreen } from './BaseScreen';
import { ScreenId } from './ScreenId';



const { ccclass, property } = _decorator;

@ccclass('ScreenManager')
export class ScreenManager extends Component {

    public static instance: ScreenManager;

    @property([Node])
    public screenNodes: Node[] = [];

    private screenMap: Map<ScreenId, BaseScreen> = new Map();
    private currentScreen: BaseScreen | null = null;

    onLoad() {
        // Singleton setup
        if (ScreenManager.instance) {
            this.destroy();
            return;
        }

        ScreenManager.instance = this;

        // Register screens
        for (const node of this.screenNodes) {

            const screen = node.getComponent(BaseScreen);
            if (!screen) {
                console.warn(`Node ${node.name} has no BaseScreen`);
                continue;
            }

            this.screenMap.set(screen.screenId, screen);
            node.active = false;
        }
    }

    start() {
        this.open(ScreenId.MAIN_MENU);
    }

    public open(id: ScreenId, data?: any): void {
        const next = this.screenMap.get(id);
        if (!next) {
            console.warn(`Screen ${id} not found`);
            return;
        }

        if (this.currentScreen) {
            this.currentScreen.hide();
        }

        this.currentScreen = next;
        this.currentScreen.show(data);
    }


    public getCurrentScreen(): BaseScreen | null {
        return this.currentScreen;
    }
}

export { ScreenId };
