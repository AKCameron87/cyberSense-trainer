import { Injectable } from '@angular/core';
import {
  UserProgress,
  GameSession,
  SessionResult,
  CategoryScore,
  Badge,
  DEFAULT_USER_PROGRESS,
  Difficulty
} from '../models/index';

const STORAGE_KEYS = {
  USER_PROGRESS: 'cyberSense_userProgress',
  SESSIONS:      'cyberSense_sessions',
  CURRENT_SESSION: 'cyberSense_currentSession'
} as const;

@Injectable({ providedIn: 'root' })
export class ProgressService {

  // ─── User Progress ───────────────────────────────────────────────

  getUserProgress(): UserProgress {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    return stored ? JSON.parse(stored) : { ...DEFAULT_USER_PROGRESS };
  }

  private saveUserProgress(progress: UserProgress): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  }

  resetProgress(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }

  // ─── Session Management ──────────────────────────────────────────

  startSession(mode: GameSession['mode'], difficulty: Difficulty): GameSession {
    const session: GameSession = {
      id:          crypto.randomUUID(),
      mode,
      difficulty,
      startedAt:   new Date().toISOString(),
      completedAt: null,
      results:     [],
      totalScore:  0,
      passed:      false
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
    return session;
  }

  getCurrentSession(): GameSession | null {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    return stored ? JSON.parse(stored) : null;
  }

  addResult(result: SessionResult): void {
    const session = this.getCurrentSession();
    if (!session) return;

    session.results.push(result);
    session.totalScore += result.pointsEarned;
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
  }

  completeSession(): GameSession | null {
    const session = this.getCurrentSession();
    if (!session) return null;

    session.completedAt = new Date().toISOString();
    const correctCount  = session.results.filter(r => r.correct).length;
    session.passed      = (correctCount / session.results.length) >= 0.7;

    // Persist to session history
    const sessions = this.getAllSessions();
    sessions.push(session);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);

    // Update overall progress
    this.updateUserProgress(session);

    return session;
  }

  getAllSessions(): GameSession[] {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return stored ? JSON.parse(stored) : [];
  }

  // ─── Progress Updates ────────────────────────────────────────────

  private updateUserProgress(session: GameSession): void {
    const progress = this.getUserProgress();

    const correct = session.results.filter(r => r.correct).length;

    progress.totalSessions++;
    progress.totalPoints   += session.totalScore;
    progress.totalCorrect  += correct;
    progress.totalAnswered += session.results.length;
    progress.lastPlayed     = new Date().toISOString();

    if (session.difficulty) {
      progress.preferredDifficulty = session.difficulty;
    }

    progress.badges = this.evaluateBadges(progress, session);

    this.saveUserProgress(progress);
  }

  updateCategoryScore(
    progress: UserProgress,
    category: string,
    correct: boolean
  ): UserProgress {
    const existing = progress.categoryScores.find(c => c.category === category);

    if (existing) {
      existing.total++;
      if (correct) existing.correct++;
      existing.percentage = Math.round((existing.correct / existing.total) * 100);
    } else {
      progress.categoryScores.push({
        category,
        correct:    correct ? 1 : 0,
        total:      1,
        percentage: correct ? 100 : 0
      });
    }

    return progress;
  }

  // ─── Badge Evaluation ────────────────────────────────────────────

  private evaluateBadges(progress: UserProgress, session: GameSession): Badge[] {
    const badges  = [...progress.badges];
    const now     = new Date().toISOString();
    const correct = session.results.filter(r => r.correct).length;
    const total   = session.results.length;

    const award = (id: string) => {
      const badge = badges.find(b => b.id === id);
      if (badge && !badge.earnedAt) badge.earnedAt = now;
    };

    // First session
    if (progress.totalSessions === 1) award('first-session');

    // Perfect score
    if (correct === total && total > 0) award('perfect-score');

    // Expert mode completion
    if (session.difficulty === Difficulty.Expert && session.passed) {
      award('expert-mode');
    }

    // Streak of 5 correct in a row
    let streak = 0;
    for (const result of session.results) {
      streak = result.correct ? streak + 1 : 0;
      if (streak >= 5) { award('streak-5'); break; }
    }

    // Phishing expert — 5 phishing sessions passed
    const phishingSessions = this.getAllSessions()
      .filter(s => s.mode === 'phishing-sim' && s.passed);
    if (phishingSessions.length >= 5) award('phishing-expert');

    // Human Firewall — completed all attack type categories
    const coveredTypes = new Set(progress.categoryScores.map(c => c.category));
    const allTypes     = ['phishing', 'vishing', 'smishing', 'baiting', 'pretexting'];
    if (allTypes.every(t => coveredTypes.has(t))) award('social-engineer');

    return badges;
  }

  // ─── Stats Helpers ───────────────────────────────────────────────

  getAccuracyPercentage(): number {
    const progress = this.getUserProgress();
    if (progress.totalAnswered === 0) return 0;
    return Math.round((progress.totalCorrect / progress.totalAnswered) * 100);
  }

  getWeakestCategory(): CategoryScore | null {
    const progress = this.getUserProgress();
    if (!progress.categoryScores.length) return null;
    return progress.categoryScores
      .slice()
      .sort((a, b) => a.percentage - b.percentage)[0];
  }

  getEarnedBadges(): Badge[] {
    return this.getUserProgress().badges.filter(b => b.earnedAt !== null);
  }
}