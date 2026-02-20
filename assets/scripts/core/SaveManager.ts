import { LevelConfig } from "../configs/GameConfig";

export interface SaveData {
    currentLevel: LevelConfig;
    score: number;
    matchedPairs: number;
    turns: number;
    cardStates: { id: number; isFlipped: boolean; isMatched: boolean }[];
}

export class SaveManager {

    private static SAVE_KEY = "memory_game";

    public static save(data: SaveData): void {
        const json = JSON.stringify(data);
        localStorage.setItem(this.SAVE_KEY + `_${data.currentLevel.id}`, json);
    }

    public static load(levelId: number): SaveData | null {
        const json = localStorage.getItem(this.SAVE_KEY + `_${levelId}`);
        if (!json) return null;

        try {
            return JSON.parse(json) as SaveData;
        } catch {
            return null;
        }
    }



    public static clearLevelData(levelId: number): void {
        localStorage.removeItem(this.SAVE_KEY + `_${levelId}`);
    }
}
