import { Injectable } from '@angular/core';
import {
  UserProgress,
  GameSession,
  SessionResult,
  CategoryScore,
  Badge,
  DEFAULT_USER_PROGRESS,
  DEFAULT_BADGES,
  Difficulty
} from '../models/index';

const STORAGE_KEYS = {
  USER_PROGRESS:   'cyberSense_userProgress',
  SESSIONS:        'cyberSense_sessions',
  CURRENT_SESSION: 'cyberSense_currentSession'
} as const;

@Injectable({ providedIn: 'root' })
export class ProgressService {

  // ─── User Progress ───────────────────────────────────────────────

  getUserProgress(): UserProgress {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (!stored) return this.buildDefaultProgress();

    const progress = JSON.parse(stored) as UserProgress;

    // Ensure badge list is always complete — merges any missing badges
    progress.badges = this.mergeBadges(progress.badges ?? []);
    return progress;
  }

  private buildDefaultProgress(): UserProgress {
    return {
      ...DEFAULT_USER_PROGRESS,
      badges:         DEFAULT_BADGES.map(b => ({ ...b })),
      categoryScores: []
    };
  }

  // Ensures all badges exist, preserving any already earned
  private mergeBadges(existing: Badge[]): Badge[] {
    return DEFAULT_BADGES.map(template => {
      const found = existing.find(b => b.id === template.id);
      return found ?? { ...template };
    });
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

    // Recalculate total from all results to avoid drift
    session.totalScore = session.results.reduce(
      (sum, r) => sum + (r.pointsEarned ?? 0), 0
    );

    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));

    // Update category scores in real time if category is provided
    if (result.category) {
      const progress = this.getUserProgress();
      this.updateCategoryScore(progress, result.category, result.correct);
      this.saveUserProgress(progress);
    }
  }

  completeSession(): GameSession | null {
    const session = this.getCurrentSession();
    if (!session) return null;

    session.completedAt = new Date().toISOString();

    // Safe pass check — handle 0 results (phishing sim counts flags, not questions)
    const correct = session.results.filter(r => r.correct).length;
    const total   = session.results.length;
    session.passed = total > 0
      ? (correct / total) >= 0.7
      : session.totalScore > 0; // phishing sim: passed if any points scored

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
    progress.totalPoints   += Math.max(0, session.totalScore); // never add negative
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
    correct:  boolean
  ): UserProgress {
    if (!category) return progress;

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
    const badges = this.mergeBadges(progress.badges);
    const now    = new Date().toISOString();

    const correct = session.results.filter(r => r.correct).length;
    const total   = session.results.length;

    const award = (id: string) => {
      const badge = badges.find(b => b.id === id);
      if (badge && !badge.earnedAt) badge.earnedAt = now;
    };

    // First session
    if (progress.totalSessions === 1) award('first-session');

    // Perfect score — all results correct and no wrong-click penalties
    if (total > 0 && correct === total) award('perfect-score');

    // Expert mode pass
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
    const phishingPassed = this.getAllSessions()
      .filter(s => s.mode === 'phishing-sim' && s.passed).length;
    if (phishingPassed >= 5) award('phishing-expert');

    // Human Firewall — all 5 attack categories covered
    const coveredTypes = new Set(progress.categoryScores.map(c => c.category));
    const allTypes     = ['phishing', 'vishing', 'smishing', 'baiting', 'pretexting'];
    if (allTypes.every(t => coveredTypes.has(t))) award('social-engineer');

    return badges;
  }

  // ─── Stats Helpers ───────────────────────────────────────────────

  getAccuracyPercentage(): number {
    const progress = this.getUserProgress();
    if (!progress.totalAnswered) return 0;
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
    return this.getUserProgress().badges.filter(b => !!b.earnedAt);
  }
}