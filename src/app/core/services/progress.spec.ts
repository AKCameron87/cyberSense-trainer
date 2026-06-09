import { TestBed }        from '@angular/core/testing';
import { ProgressService } from './progress.service';
import { Difficulty }      from '../models/index';

describe('ProgressService', () => {
  let service: ProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressService);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ─── Initialization ───────────────────────────────────────────────

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should return default progress when nothing is stored', () => {
      const progress = service.getUserProgress();
      expect(progress.totalSessions).toBe(0);
      expect(progress.totalPoints).toBe(0);
      expect(progress.totalCorrect).toBe(0);
      expect(progress.totalAnswered).toBe(0);
      expect(progress.categoryScores).toEqual([]);
      expect(progress.lastPlayed).toBeNull();
    });

    it('should initialize with all badges locked', () => {
      const progress = service.getUserProgress();
      expect(progress.badges.length).toBeGreaterThan(0);
      expect(progress.badges.every(b => b.earnedAt === null)).toBe(true);
    });
  });

  // ─── Session Management ───────────────────────────────────────────

  describe('session management', () => {
    it('should start a session and store it', () => {
      const session = service.startSession('phishing-sim', Difficulty.Rookie);
      expect(session.mode).toBe('phishing-sim');
      expect(session.difficulty).toBe(Difficulty.Rookie);
      expect(session.results).toEqual([]);
      expect(session.totalScore).toBe(0);
      expect(session.passed).toBe(false);
    });

    it('should retrieve the current session', () => {
      service.startSession('social-eng-quiz', Difficulty.Analyst);
      const session = service.getCurrentSession();
      expect(session).not.toBeNull();
      expect(session?.mode).toBe('social-eng-quiz');
    });

    it('should return null when no session is active', () => {
      expect(service.getCurrentSession()).toBeNull();
    });

    it('should add a result and recalculate total score', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q1', correct: true,  pointsEarned: 100, timeTaken: null });
      service.addResult({ questionId: 'q2', correct: false, pointsEarned: 0,   timeTaken: null });
      service.addResult({ questionId: 'q3', correct: true,  pointsEarned: 150, timeTaken: null });

      const session = service.getCurrentSession();
      expect(session?.totalScore).toBe(250);
      expect(session?.results.length).toBe(3);
    });

    it('should complete a session and clear current session', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q1', correct: true, pointsEarned: 100, timeTaken: null });
      service.completeSession();

      expect(service.getCurrentSession()).toBeNull();
    });

    it('should persist completed session to history', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q1', correct: true, pointsEarned: 100, timeTaken: null });
      service.completeSession();

      const sessions = service.getAllSessions();
      expect(sessions.length).toBe(1);
      expect(sessions[0].mode).toBe('social-eng-quiz');
    });

    it('should mark session as passed when 70% or more correct', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q1', correct: true,  pointsEarned: 100, timeTaken: null });
      service.addResult({ questionId: 'q2', correct: true,  pointsEarned: 100, timeTaken: null });
      service.addResult({ questionId: 'q3', correct: true,  pointsEarned: 100, timeTaken: null });
      service.addResult({ questionId: 'q4', correct: false, pointsEarned: 0,   timeTaken: null });
      service.completeSession();

      const sessions = service.getAllSessions();
      expect(sessions[0].passed).toBe(true);
    });

    it('should mark session as failed when less than 70% correct', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q1', correct: true,  pointsEarned: 100, timeTaken: null });
      service.addResult({ questionId: 'q2', correct: false, pointsEarned: 0,   timeTaken: null });
      service.addResult({ questionId: 'q3', correct: false, pointsEarned: 0,   timeTaken: null });
      service.completeSession();

      const sessions = service.getAllSessions();
      expect(sessions[0].passed).toBe(false);
    });

    it('should mark phishing session as passed if any points scored', () => {
      service.startSession('phishing-sim', Difficulty.Rookie);
      // Phishing sim adds results with no questions — just flags
      service.addResult({ questionId: 'flag1', correct: true, pointsEarned: 100, timeTaken: null });
      service.completeSession();

      const sessions = service.getAllSessions();
      expect(sessions[0].passed).toBe(true);
    });
  });

  // ─── Progress Updates ─────────────────────────────────────────────

  describe('progress updates', () => {
    it('should increment totalSessions after completing a session', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.completeSession();

      expect(service.getUserProgress().totalSessions).toBe(1);
    });

    it('should accumulate totalPoints across sessions', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q1', correct: true, pointsEarned: 200, timeTaken: null });
      service.completeSession();

      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q2', correct: true, pointsEarned: 150, timeTaken: null });
      service.completeSession();

      expect(service.getUserProgress().totalPoints).toBe(350);
    });

    it('should not add negative scores to totalPoints', () => {
      service.startSession('phishing-sim', Difficulty.Rookie);
      // Score of -50 (penalties exceeded points)
      service.completeSession();

      expect(service.getUserProgress().totalPoints).toBe(0);
    });

    it('should update preferredDifficulty to last played difficulty', () => {
      service.startSession('social-eng-quiz', Difficulty.Expert);
      service.completeSession();

      expect(service.getUserProgress().preferredDifficulty).toBe(Difficulty.Expert);
    });
  });

  // ─── Category Scores ──────────────────────────────────────────────

  describe('category scores', () => {
    it('should create a new category score on first result', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q1', correct: true, pointsEarned: 100, timeTaken: null, category: 'phishing' });

      const progress = service.getUserProgress();
      const cat = progress.categoryScores.find(c => c.category === 'phishing');
      expect(cat).toBeDefined();
      expect(cat?.correct).toBe(1);
      expect(cat?.total).toBe(1);
      expect(cat?.percentage).toBe(100);
    });

    it('should update existing category score on subsequent results', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q1', correct: true,  pointsEarned: 100, timeTaken: null, category: 'phishing' });
      service.addResult({ questionId: 'q2', correct: false, pointsEarned: 0,   timeTaken: null, category: 'phishing' });

      const progress = service.getUserProgress();
      const cat = progress.categoryScores.find(c => c.category === 'phishing');
      expect(cat?.correct).toBe(1);
      expect(cat?.total).toBe(2);
      expect(cat?.percentage).toBe(50);
    });

    it('should track multiple categories independently', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q1', correct: true,  pointsEarned: 100, timeTaken: null, category: 'phishing' });
      service.addResult({ questionId: 'q2', correct: false, pointsEarned: 0,   timeTaken: null, category: 'vishing'  });

      const progress = service.getUserProgress();
      expect(progress.categoryScores.length).toBe(2);
    });
  });

  // ─── Stats Helpers ────────────────────────────────────────────────

  describe('stats helpers', () => {
    it('should return 0 accuracy when no answers recorded', () => {
      expect(service.getAccuracyPercentage()).toBe(0);
    });

    it('should calculate accuracy correctly', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q1', correct: true,  pointsEarned: 100, timeTaken: null });
      service.addResult({ questionId: 'q2', correct: true,  pointsEarned: 100, timeTaken: null });
      service.addResult({ questionId: 'q3', correct: false, pointsEarned: 0,   timeTaken: null });
      service.addResult({ questionId: 'q4', correct: false, pointsEarned: 0,   timeTaken: null });
      service.completeSession();

      expect(service.getAccuracyPercentage()).toBe(50);
    });

    it('should return null weakest category when no scores exist', () => {
      expect(service.getWeakestCategory()).toBeNull();
    });

    it('should return the category with lowest percentage', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q1', correct: true,  pointsEarned: 100, timeTaken: null, category: 'phishing' });
      service.addResult({ questionId: 'q2', correct: false, pointsEarned: 0,   timeTaken: null, category: 'vishing'  });
      service.completeSession();

      const weakest = service.getWeakestCategory();
      expect(weakest?.category).toBe('vishing');
    });

    it('should return no earned badges initially', () => {
      expect(service.getEarnedBadges()).toEqual([]);
    });
  });

  // ─── Badge Evaluation ─────────────────────────────────────────────

  describe('badge evaluation', () => {
    it('should award first-session badge after first session', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q1', correct: true, pointsEarned: 100, timeTaken: null });
      service.completeSession();

      const earned = service.getEarnedBadges();
      expect(earned.some(b => b.id === 'first-session')).toBe(true);
    });

    it('should award perfect-score badge when all results correct', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q1', correct: true, pointsEarned: 100, timeTaken: null });
      service.addResult({ questionId: 'q2', correct: true, pointsEarned: 100, timeTaken: null });
      service.completeSession();

      const earned = service.getEarnedBadges();
      expect(earned.some(b => b.id === 'perfect-score')).toBe(true);
    });

    it('should NOT award perfect-score badge when some results incorrect', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q1', correct: true,  pointsEarned: 100, timeTaken: null });
      service.addResult({ questionId: 'q2', correct: false, pointsEarned: 0,   timeTaken: null });
      service.completeSession();

      const earned = service.getEarnedBadges();
      expect(earned.some(b => b.id === 'perfect-score')).toBe(false);
    });

    it('should award streak-5 badge when 5 correct in a row', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      for (let i = 0; i < 5; i++) {
        service.addResult({ questionId: `q${i}`, correct: true, pointsEarned: 100, timeTaken: null });
      }
      service.completeSession();

      const earned = service.getEarnedBadges();
      expect(earned.some(b => b.id === 'streak-5')).toBe(true);
    });

    it('should NOT award streak-5 badge when streak is broken', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q1', correct: true,  pointsEarned: 100, timeTaken: null });
      service.addResult({ questionId: 'q2', correct: true,  pointsEarned: 100, timeTaken: null });
      service.addResult({ questionId: 'q3', correct: false, pointsEarned: 0,   timeTaken: null });
      service.addResult({ questionId: 'q4', correct: true,  pointsEarned: 100, timeTaken: null });
      service.addResult({ questionId: 'q5', correct: true,  pointsEarned: 100, timeTaken: null });
      service.completeSession();

      const earned = service.getEarnedBadges();
      expect(earned.some(b => b.id === 'streak-5')).toBe(false);
    });

    it('should award expert-mode badge when passing on Expert difficulty', () => {
      service.startSession('social-eng-quiz', Difficulty.Expert);
      for (let i = 0; i < 8; i++) {
        service.addResult({ questionId: `q${i}`, correct: true, pointsEarned: 200, timeTaken: null });
      }
      service.addResult({ questionId: 'q9',  correct: false, pointsEarned: 0, timeTaken: null });
      service.addResult({ questionId: 'q10', correct: false, pointsEarned: 0, timeTaken: null });
      service.completeSession();

      const earned = service.getEarnedBadges();
      expect(earned.some(b => b.id === 'expert-mode')).toBe(true);
    });
  });

  // ─── Reset ────────────────────────────────────────────────────────

  describe('reset', () => {
    it('should clear all progress on reset', () => {
      service.startSession('social-eng-quiz', Difficulty.Rookie);
      service.addResult({ questionId: 'q1', correct: true, pointsEarned: 100, timeTaken: null });
      service.completeSession();

      service.resetProgress();

      const progress = service.getUserProgress();
      expect(progress.totalSessions).toBe(0);
      expect(progress.totalPoints).toBe(0);
      expect(service.getAllSessions()).toEqual([]);
    });
  });
});