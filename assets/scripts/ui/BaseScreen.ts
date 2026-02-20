import { _decorator, Component } from 'cc';
import { ScreenId } from './ScreenId';

const { ccclass, property } = _decorator;

@ccclass('BaseScreen')
export abstract class BaseScreen extends Component {

    @property
    public screenId: ScreenId = ScreenId.MAIN_MENU;

    private initialized: boolean = false;

    protected abstract onInit(): void;

    protected onShow(data?: any): void {}
    protected onHide(): void {}

    public show(data?: any): void {
        this.node.active = true;

        if (!this.initialized) {
            this.onInit();
            this.initialized = true;
        }

        this.onShow(data);
    }

    public hide(): void {
        this.onHide();
        this.node.active = false;
    }
}
