import { _decorator, Component, AudioSource, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {

    @property(AudioSource)
    audioSource: AudioSource = null!;

    @property(AudioClip)
    flipClip: AudioClip = null!;

    @property(AudioClip)
    matchClip: AudioClip = null!;

    @property(AudioClip)
    mismatchClip: AudioClip = null!;

    @property(AudioClip)
    gameOverClip: AudioClip = null!;

    private soundEnabled: boolean = true;

    public static Instance: SoundManager;

    onLoad() {
        SoundManager.Instance = this;
    }

    public playFlip() {
        console.log("Playing flip sound");
        if (!this.soundEnabled) return;
        this.audioSource.playOneShot(this.flipClip, 0.2);
    }

    public playMatch() {
        if (!this.soundEnabled) return;
        this.audioSource.playOneShot(this.matchClip);
    }

    public playMismatch() {
        if (!this.soundEnabled) return;
        this.audioSource.playOneShot(this.mismatchClip, 0.6);
    }

    public playGameOver() {
        if (!this.soundEnabled) return;
        this.audioSource.playOneShot(this.gameOverClip);
    }

    public toggleSound() {
        this.soundEnabled = !this.soundEnabled;
    }
}
