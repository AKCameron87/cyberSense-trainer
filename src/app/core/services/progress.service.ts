import { Injectable } from '@angular/core';
import {
  UserProgress,
  GameSession,
  SessionResult,
  Badge,
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
    progress.badges = this.mergeBadges(progress.badges ?? []);
    return progress;
  }

  private buildDefaultProgress(): UserProgress {
    return {
      totalSessions:       0,
      totalPoints:         0,
      totalCorrect:        0,
      totalAnswered:       0,
      categoryScores:      [],
      badges:              DEFAULT_BADGES.map(b => ({ ...b })),
      lastPlayed:          null,
      preferredDifficulty: null
    };
  }

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
    session.totalScore = session.results.reduce(
      (sum, r) => sum + (r.pointsEarned ?? 0), 0
    );
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));

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

    const correct      = session.results.filter(r => r.correct).length;
    const total        = session.results.length;
    session.passed     = total > 0
      ? (correct / total) >= 0.7
      : session.totalScore > 0;

    const sessions = this.getAllSessions();
    sessions.push(session);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);

    this.updateUserProgress(session, sessions);

    return session;
  }

  getAllSessions(): GameSession[] {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return stored ? JSON.parse(stored) : [];
  }

  // ─── Progress Updates ────────────────────────────────────────────

  private updateUserProgress(session: GameSession, allSessions: GameSession[]): void {
    const progress = this.getUserProgress();
    const correct  = session.results.filter(r => r.correct).length;

    progress.totalSessions++;
    progress.totalPoints   += Math.max(0, session.totalScore);
    progress.totalCorrect  += correct;
    progress.totalAnswered += session.results.length;
    progress.lastPlayed     = new Date().toISOString();

    if (session.difficulty) {
      progress.preferredDifficulty = session.difficulty;
    }

    progress.badges = this.evaluateBadges(progress, session, allSessions);
    this.saveUserProgress(progress);
  }

  private updateCategoryScore(
    progress: UserProgress,
    category: string,
    correct:  boolean
  ): void {
    if (!category) return;

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
  }

  // ─── Badge Evaluation ────────────────────────────────────────────

  private evaluateBadges(
    progress:    UserProgress,
    session:     GameSession,
    allSessions: GameSession[]
  ): Badge[] {
    const badges  = this.mergeBadges(progress.badges);
    const now     = new Date().toISOString();
    const correct = session.results.filter(r => r.correct).length;
    const total   = session.results.length;

    const award = (id: string) => {
      const badge = badges.find(b => b.id === id);
      if (badge && !badge.earnedAt) badge.earnedAt = now;
    };

    if (progress.totalSessions === 1)                           award('first-session');
    if (total > 0 && correct === total)                         award('perfect-score');
    if (session.difficulty === Difficulty.Expert && session.passed) award('expert-mode');

    let streak = 0;
    for (const result of session.results) {
      streak = result.correct ? streak + 1 : 0;
      if (streak >= 5) { award('streak-5'); break; }
    }

    const phishingPassed = allSessions
      .filter(s => s.mode === 'phishing-sim' && s.passed).length;
    if (phishingPassed >= 5) award('phishing-expert');

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

  getWeakestCategory() {
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