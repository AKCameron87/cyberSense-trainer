export enum Difficulty {
    Rookie = 'rookie',
    Analyst = 'analyst',
    Expert = 'expert'
}

// Create difficulty interface
export interface DifficultyConfig {
    level: Difficulty;
    label: string;
    description: string;
    timerSeconds: number | null; // null = no timer
    pointMultiplier: number;
    badgeClass: string; 
}

export const DIFFICULTY_CONFIGS: DifficultyConfig[] = [
    {
        level: Difficulty.Rookie,
        label: 'Rookie',
        description: 'No time pressure. Learn the basics of spotting threats',
        timerSeconds: null,
        pointMultiplier: 1,
        badgeClass: 'badge-rookie'
    },
    {
        level: Difficulty.Analyst,
        label: 'Analyst',
        description: "Moderate time pressure. Think fast like a real analyst!",
        timerSeconds: 30,
        pointMultiplier: 1.5,
        badgeClass: 'badge-analyst'
    },
    {
        level: Difficulty.Expert,
        label: 'Expert',
        description: 'High pressure. Expert level threats with tight time schedules for response. Tread carefully!',
        timerSeconds: 15,
        pointMultiplier: 2,
        badgeClass: 'badge-expert'
    }
];