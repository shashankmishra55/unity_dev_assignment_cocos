import { MATCH_SCORE, TURN_SCORE } from "../configs/GameConfig";

export class ScoreSystem {

    private matchCount = 0;
    private turnCount = 0;
    private score = 0;

   

    constructor(private onUpdate: (data: { matches: number; turns: number }) => void) {}

    public addTurn() {
        this.turnCount++;
        this.score += TURN_SCORE;
        this.emit();
    }

    public addMatch() {
        this.matchCount++;
        this.score += MATCH_SCORE;
        this.emit();
    }

    private emit() {
        this.onUpdate({
            matches: this.matchCount,
            turns: this.turnCount
        });
    }

    public getScore() {
        return this.score;
    }

    public getTurns() {
        return this.turnCount;
    }

    public setMatchCount(count: number) {
        this.matchCount = count;
        this.emit();
    }

    public setScore(score: number) {  
        this.score = score; 
    }
    
    public setTurns(turns: number) {  
        this.turnCount = turns; 
        this.emit();
    }   

    public reset(): void {
        this.matchCount = 0;
        this.turnCount = 0;
        this.score = 0;
        this.emit();
    }
}
