import { Injectable } from '@angular/core';
import { PhishingScenario, QuizQuestion, Difficulty, AttackType } from '../models/index';
import { AdminService } from './admin.service';

@Injectable({ providedIn: 'root' })
export class ScenarioService {

  private staticPhishing: PhishingScenario[] = [];
  private staticQuiz:     QuizQuestion[]     = [];

  private customPhishing: PhishingScenario[] = [];
  private customQuiz:     QuizQuestion[]     = [];

  private staticLoaded = false;
  private customLoaded = false;

  private _allPhishing: PhishingScenario[] = [];
  private _allQuiz:     QuizQuestion[]     = [];

  constructor(private adminService: AdminService) {}

  // ─── Load static scenarios (lazy — only when first needed) ───────

  async loadStaticScenarios(): Promise<void> {
    if (this.staticLoaded) return;
    try {
      const [phishingRes, quizRes] = await Promise.all([
        fetch('assets/data/phishing-scenarios.json'),
        fetch('assets/data/quiz-scenarios.json')
      ]);
      this.staticPhishing = await phishingRes.json() as PhishingScenario[];
      this.staticQuiz     = await quizRes.json()     as QuizQuestion[];
      this.staticLoaded   = true;
      this.rebuildArrays();
    } catch (err) {
      console.error('Failed to load static scenarios:', err);
    }
  }

  // ─── Load custom scenarios from Firestore ────────────────────────

  async loadCustomScenarios(): Promise<void> {
    if (this.customLoaded) return;
    try {
      this.customPhishing = await this.adminService.getCustomScenarios();
      this.customQuiz     = await this.adminService.getCustomQuestions();
      this.customLoaded   = true;
      this.rebuildArrays();
    } catch (err) {
      console.warn('Could not load custom scenarios from Firestore:', err);
    }
  }

  // ─── Load everything — called by game modes ───────────────────────

  async loadAll(): Promise<void> {
    await Promise.all([
      this.loadStaticScenarios(),
      this.loadCustomScenarios()
    ]);
  }

  private rebuildArrays(): void {
    this._allPhishing = [...this.staticPhishing, ...this.customPhishing];
    this._allQuiz     = [...this.staticQuiz,     ...this.customQuiz];
  }

  // ─── Phishing ─────────────────────────────────────────────────────

  getPhishingScenarios(difficulty?: Difficulty): PhishingScenario[] {
    return difficulty
      ? this._allPhishing.filter(s => s.difficulty === difficulty)
      : this._allPhishing;
  }

  getRandomPhishingScenarios(count: number, difficulty?: Difficulty): PhishingScenario[] {
    return this.shuffleAndTake(this.getPhishingScenarios(difficulty), count);
  }

  // ─── Quiz ─────────────────────────────────────────────────────────

  getQuizQuestions(difficulty?: Difficulty, attackType?: AttackType): QuizQuestion[] {
    let questions = this._allQuiz;
    if (difficulty)  questions = questions.filter(q => q.difficulty === difficulty);
    if (attackType)  questions = questions.filter(q => q.attackType === attackType);
    return questions;
  }

  getRandomQuizQuestions(
    count:        number,
    difficulty?:  Difficulty,
    attackTypes?: AttackType[]
  ): QuizQuestion[] {
    let pool = this._allQuiz;
    if (difficulty)          pool = pool.filter(q => q.difficulty === difficulty);
    if (attackTypes?.length) pool = pool.filter(q => attackTypes.includes(q.attackType));
    return this.shuffleAndTake(pool, count);
  }

  // ─── Helpers ──────────────────────────────────────────────────────

  private shuffleAndTake<T>(arr: T[], count: number): T[] {
    return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
  }
}