export class ScoreSystem {

    private matchCount = 0;
    private turnCount = 0;

    constructor(private onUpdate: (data: { matches: number; turns: number }) => void) {}

    public addTurn() {
        this.turnCount++;
        this.emit();
    }

    public addMatch() {
        this.matchCount++;
        this.emit();
    }

    private emit() {
        this.onUpdate({
            matches: this.matchCount,
            turns: this.turnCount
        });
    }

    public reset(): void {
        this.matchCount = 0;
        this.turnCount = 0;
        this.emit();
    }
}
