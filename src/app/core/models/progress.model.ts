import { Difficulty } from './difficulty.model';
import { AttackType } from './quiz.model';

export interface SessionResult {
    questionId: string;
    correct: boolean;
    pointsEarned: number;
    timeTaken: number | null; // seconds or null if no timer (rookie)
}

export interface CategoryScore {
    category: string; // AttackType or PhishingScenario category
    correct: number;
    total: number;
    percentage: number;
}

export interface Badge {
    id: string;
    label: string;
    description: string;
    icon: string; // emoji or icon identifier
    earnedAt: string | null; // ISO date string, null if not earned yet
}

// User Stats & Achievements
export interface UserProgress {
    totalSessions: number;
    totalPoints: number;
    totalCorrect: number;
    totalAnswered: number;
    categoryScores: CategoryScore[]; // lifetime scores
    badges: Badge[]; // Badges earned lifetime
    lastPlayed: string | null; // ISO date string
    preferredDifficulty: Difficulty | null; // Average Difficulty played
}

export interface GameSession {
    id: string; 
    mode: 'phishing-sim' | 'social-eng-quiz';
    difficulty: Difficulty;
    startedAt: string; // ISO date string
    completedAt: string | null;
    results: SessionResult[];
    totalScore: number;
    passed: boolean;
}

export const DEFAULT_BADGES: Badge[] = [
  {
    id:          'first-session',
    label:       'First Steps',
    description: 'Completed your first training session',
    icon:        '🎯',
    earnedAt:    null
  },
  {
    id:          'perfect-score',
    label:       'Perfect Score',
    description: 'Scored 100% in a single session',
    icon:        '🏆',
    earnedAt:    null
  },
  {
    id:          'phishing-expert',
    label:       'Phishing Expert',
    description: 'Identified all red flags in 5 phishing simulations',
    icon:        '🎣',
    earnedAt:    null
  },
  {
    id:          'social-engineer',
    label:       'Human Firewall',
    description: 'Completed all social engineering attack types',
    icon:        '🛡️',
    earnedAt:    null
  },
  {
    id:          'expert-mode',
    label:       'Under Pressure',
    description: 'Completed a full session on Expert difficulty',
    icon:        '⚡',
    earnedAt:    null
  },
  {
    id:          'streak-5',
    label:       'On A Roll',
    description: 'Answered 5 questions correctly in a row',
    icon:        '🔥',
    earnedAt:    null
  }
];

export const DEFAULT_USER_PROGRESS: UserProgress = {
    totalSessions: 0,
    totalPoints: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    categoryScores: [],
    badges: DEFAULT_BADGES,
    lastPlayed: null,
    preferredDifficulty: null,
};
