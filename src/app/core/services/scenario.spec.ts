import { TestBed }        from '@angular/core/testing';
import { ScenarioService } from './scenario.service';
import { AdminService }    from './admin.service';
import { Difficulty, AttackType, PhishingScenario, QuizQuestion } from '../models/index';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockPhishingScenarios: PhishingScenario[] = [
  {
    id: 'p1', type: 'email' as any, difficulty: Difficulty.Rookie,
    title: 'Fake Bank Alert', description: 'Test', category: 'Phishing',
    explanation: '', subject: 'Alert', senderEmail: 'fake@bank.com',
    totalPoints: 400, redFlags: [], bodyHtml: ''
  },
  {
    id: 'p2', type: 'email' as any, difficulty: Difficulty.Analyst,
    title: 'Fake Invoice', description: 'Test', category: 'Phishing',
    explanation: '', subject: 'Invoice', senderEmail: 'fake@vendor.com',
    totalPoints: 400, redFlags: [], bodyHtml: ''
  },
  {
    id: 'p3', type: 'email' as any, difficulty: Difficulty.Expert,
    title: 'Expert Phish', description: 'Test', category: 'Phishing',
    explanation: '', subject: 'Urgent', senderEmail: 'real@bank.com',
    totalPoints: 400, redFlags: [], bodyHtml: ''
  }
];

const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1', attackType: AttackType.Phishing, difficulty: Difficulty.Rookie,
    scenario: 'Phishing scenario', options: [], correctId: 'a',
    explanation: '', points: 100, tip: ''
  },
  {
    id: 'q2', attackType: AttackType.Vishing, difficulty: Difficulty.Rookie,
    scenario: 'Vishing scenario', options: [], correctId: 'b',
    explanation: '', points: 100, tip: ''
  },
  {
    id: 'q3', attackType: AttackType.Smishing, difficulty: Difficulty.Analyst,
    scenario: 'Smishing scenario', options: [], correctId: 'c',
    explanation: '', points: 150, tip: ''
  },
  {
    id: 'q4', attackType: AttackType.Phishing, difficulty: Difficulty.Analyst,
    scenario: 'Another phishing', options: [], correctId: 'd',
    explanation: '', points: 150, tip: ''
  },
  {
    id: 'q5', attackType: AttackType.Baiting, difficulty: Difficulty.Expert,
    scenario: 'Baiting scenario', options: [], correctId: 'a',
    explanation: '', points: 200, tip: ''
  }
];

const mockAdminService = {
  getCustomScenarios: (): Promise<PhishingScenario[]> => Promise.resolve([]),
  getCustomQuestions: (): Promise<QuizQuestion[]>     => Promise.resolve([])
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ScenarioService', () => {
  let service: ScenarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScenarioService,
        { provide: AdminService, useValue: mockAdminService }
      ]
    });
    service = TestBed.inject(ScenarioService);
  });

  // ─── Initialisation ─────────────────────────────────────────────────────────

  describe('initialisation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should start with empty scenario arrays before loading', () => {
      expect(service.getPhishingScenarios().length).toBe(0);
      expect(service.getQuizQuestions().length).toBe(0);
    });
  });

  // ─── Loading ─────────────────────────────────────────────────────────────────

  describe('loadCustomScenarios', () => {
    it('should not load twice when called multiple times', async () => {
      let callCount = 0;
      (service as any).adminService = {
        getCustomScenarios: () => { callCount++; return Promise.resolve([] as PhishingScenario[]); },
        getCustomQuestions: () => Promise.resolve([] as QuizQuestion[])
      };
      (service as any).customLoaded = false;
      await service.loadCustomScenarios();
      await service.loadCustomScenarios();
      expect(callCount).toBe(1);
    });

    it('should merge custom scenarios with static ones', async () => {
      const customScenario: PhishingScenario = { ...mockPhishingScenarios[0], id: 'custom-1' };
      (service as any).adminService = {
        getCustomScenarios: () => Promise.resolve([customScenario]),
        getCustomQuestions: () => Promise.resolve([] as QuizQuestion[])
      };
      (service as any).staticPhishing = [mockPhishingScenarios[0]];
      (service as any).staticLoaded   = true;
      (service as any).customLoaded   = false;
      (service as any)._allPhishing   = [mockPhishingScenarios[0]];

      await service.loadCustomScenarios();

      const all = service.getPhishingScenarios();
      expect(all.length).toBe(2);
      expect(all.some(s => s.id === 'custom-1')).toBe(true);
    });
  });

  // ─── Phishing Scenarios ──────────────────────────────────────────────────────

  describe('getPhishingScenarios', () => {
    beforeEach(() => {
      (service as any).staticPhishing = mockPhishingScenarios;
      (service as any)._allPhishing   = mockPhishingScenarios;
    });

    it('should return all scenarios when no difficulty filter', () => {
      expect(service.getPhishingScenarios().length).toBe(3);
    });

    it('should filter by difficulty', () => {
      const rookie = service.getPhishingScenarios(Difficulty.Rookie);
      expect(rookie.length).toBe(1);
      expect(rookie[0].id).toBe('p1');
    });

    it('should return empty array for difficulty with no scenarios', () => {
      const expert = service.getPhishingScenarios(Difficulty.Expert);
      expect(expert.length).toBe(1);
      expect(expert[0].difficulty).toBe(Difficulty.Expert);
    });
  });

  describe('getRandomPhishingScenarios', () => {
    beforeEach(() => {
      (service as any).staticPhishing = mockPhishingScenarios;
      (service as any)._allPhishing   = mockPhishingScenarios;
    });

    it('should return requested count', () => {
      const result = service.getRandomPhishingScenarios(2);
      expect(result.length).toBe(2);
    });

    it('should return all when count exceeds pool size', () => {
      const result = service.getRandomPhishingScenarios(10);
      expect(result.length).toBe(3);
    });

    it('should filter by difficulty when provided', () => {
      const result = service.getRandomPhishingScenarios(5, Difficulty.Rookie);
      expect(result.every(s => s.difficulty === Difficulty.Rookie)).toBe(true);
    });
  });

  // ─── Quiz Questions ──────────────────────────────────────────────────────────

  describe('getQuizQuestions', () => {
    beforeEach(() => {
      (service as any).staticQuiz = mockQuizQuestions;
      (service as any)._allQuiz   = mockQuizQuestions;
    });

    it('should return all questions when no filters', () => {
      expect(service.getQuizQuestions().length).toBe(5);
    });

    it('should filter by difficulty', () => {
      const rookie = service.getQuizQuestions(Difficulty.Rookie);
      expect(rookie.length).toBe(2);
      expect(rookie.every(q => q.difficulty === Difficulty.Rookie)).toBe(true);
    });

    it('should filter by attack type', () => {
      const phishing = service.getQuizQuestions(undefined, AttackType.Phishing);
      expect(phishing.length).toBe(2);
      expect(phishing.every(q => q.attackType === AttackType.Phishing)).toBe(true);
    });

    it('should filter by both difficulty and attack type', () => {
      const result = service.getQuizQuestions(Difficulty.Analyst, AttackType.Phishing);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('q4');
    });
  });

  describe('getRandomQuizQuestions', () => {
    beforeEach(() => {
      (service as any).staticQuiz = mockQuizQuestions;
      (service as any)._allQuiz   = mockQuizQuestions;
    });

    it('should return requested count', () => {
      const result = service.getRandomQuizQuestions(3);
      expect(result.length).toBe(3);
    });

    it('should return all when count exceeds pool size', () => {
      const result = service.getRandomQuizQuestions(100);
      expect(result.length).toBe(5);
    });

    it('should filter by difficulty', () => {
      const result = service.getRandomQuizQuestions(10, Difficulty.Rookie);
      expect(result.every(q => q.difficulty === Difficulty.Rookie)).toBe(true);
    });

    it('should filter by attack types array', () => {
      const result = service.getRandomQuizQuestions(10, undefined, [AttackType.Vishing, AttackType.Smishing]);
      expect(result.every(q => [AttackType.Vishing, AttackType.Smishing].includes(q.attackType))).toBe(true);
    });

    it('should return different orders on repeated calls', () => {
      // Run 10 times — statistically extremely unlikely to get same order every time
      const orders = new Set<string>();
      for (let i = 0; i < 10; i++) {
        const result = service.getRandomQuizQuestions(5);
        orders.add(result.map(q => q.id).join(','));
      }
      expect(orders.size).toBeGreaterThan(1);
    });
  });
});
