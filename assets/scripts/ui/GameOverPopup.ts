import { _decorator, Component, Label, tween, UIOpacity, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('GameOverPopup')
export class GameOverPopup extends Component {

    @property(Label)
    scoreLabel: Label = null;

    show(score: number) {
        this.node.active = true;
        this.scoreLabel.string = `You scored: ${score}`;
        this.playAnimation();
    }

    hide() {
        this.node.active = false;
    }

    private playAnimation() {
       const uiOpacity = this.node.getComponent(UIOpacity)!;
        uiOpacity.opacity = 0;
        tween(uiOpacity)
        .to(0.3, { opacity: 255 })
        .start();
    }
}
