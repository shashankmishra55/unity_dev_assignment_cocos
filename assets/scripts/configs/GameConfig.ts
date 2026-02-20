export interface LevelConfig {
    id: number;
    rows: number;
    cols: number;
}

export const LEVELS: LevelConfig[] = [
    { id: 1, rows: 2, cols: 4 },
    { id: 2, rows: 2, cols: 6},
    { id: 3, rows: 3, cols: 4 },
    { id: 4, rows: 4, cols: 4 },
    { id: 5, rows: 4, cols: 5 },
    { id: 6, rows: 5, cols: 6 },
];

export const TURN_SCORE = -10;
export const MATCH_SCORE = 50;
