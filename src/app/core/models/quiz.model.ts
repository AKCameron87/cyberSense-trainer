import { Difficulty } from './difficulty.model';

export enum AttackType {
    Phishing = 'phishing',
    Vishing = 'vishing',
    Smishing = 'smishing',
    Baiting = 'baiting',
    Pretexting = 'pretexting'
}

export interface QuizOption {
    id: string; // 'a' | 'b' | 'c' | 'd' etc...
    text: string; 
}

export interface QuizQuestion {
    id: string;
    attackType: AttackType;
    difficulty: Difficulty;
    scenario: string; // the scenario text that is shown on the card
    options: QuizOption[];
    correctId: string; // id of the correct question option
    explanation: string // shown after answering
    points: number; 
    tip: string; // a short actionable security tip
}

