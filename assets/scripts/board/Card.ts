import { _decorator, Button, Component, Sprite, tween, UIOpacity, Vec3 } from 'cc';
import { CardModel } from './CardModel';

const { ccclass, property } = _decorator;

@ccclass('Card')
export class Card extends Component {

    @property(Sprite)
    front: Sprite = null;

    @property(Sprite)
    back: Sprite = null;

    private model: CardModel;
    private isAnimating = false;

    init(model: CardModel, spriteFrame) {
        this.model = model;
        this.front.spriteFrame = spriteFrame;
        this.setFace(false);
    }

    onClick() {
        if (this.isAnimating) return;
        if (this.model.isMatched) return;
        if (this.model.isFlipped) return;

        this.flip(true);
    }

    flip(showFront: boolean) {

        if (this.isAnimating) return;

        this.isAnimating = true;

        const originalScale = this.node.scale.clone();

        tween(this.node)
            .to(0.2, { 
                scale: new Vec3(0, originalScale.y, originalScale.z)
            })
            .call(() => {
                this.setFace(showFront);
            })
            .to(0.2, { 
                scale: new Vec3(originalScale.x, originalScale.y, originalScale.z)
            })
            .call(() => {
                this.isAnimating = false;
                if(showFront) {
                    this.node.emit("CARD_FLIPPED", this);
                }
            })
            .start();
    }


    setFace(showFront: boolean) {
        this.front.node.active = showFront;
        this.back.node.active = !showFront;
        this.model.isFlipped = showFront;
    }

    getModel(): CardModel {
        return this.model;
    }

    onCardMatched() {
        const opacity = this.getComponent(UIOpacity);
        if (!opacity) return;
        tween(opacity)
        .to(0.25, { opacity: 100 })
        .start();
    }
}
