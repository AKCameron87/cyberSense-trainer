import { Injectable } from '@angular/core';
import { PhishingScenario, QuizQuestion, Difficulty, AttackType } from '../models/index';
import { AdminService } from './admin.service';

import phishingData from '../../../assets/data/phishing-scenarios.json';
import quizData     from '../../../assets/data/quiz-scenarios.json';

@Injectable({ providedIn: 'root' })
export class ScenarioService {

  private staticPhishing: PhishingScenario[] = phishingData as PhishingScenario[];
  private staticQuiz:     QuizQuestion[]     = quizData     as QuizQuestion[];

  private customPhishing: PhishingScenario[] = [];
  private customQuiz:     QuizQuestion[]     = [];
  private customLoaded    = false;

  constructor(private adminService: AdminService) {}

  // ─── Load custom scenarios from Firestore ────────────────────────

  async loadCustomScenarios(): Promise<void> {
    if (this.customLoaded) return;
    try {
      this.customPhishing = await this.adminService.getCustomScenarios();
      this.customQuiz     = await this.adminService.getCustomQuestions();
      this.customLoaded   = true;
    } catch (err) {
      console.warn('Could not load custom scenarios from Firestore:', err);
    }
  }

  // ─── Combined getters ─────────────────────────────────────────────

  private get allPhishing(): PhishingScenario[] {
    return [...this.staticPhishing, ...this.customPhishing];
  }

  private get allQuiz(): QuizQuestion[] {
    return [...this.staticQuiz, ...this.customQuiz];
  }

  // ─── Phishing ─────────────────────────────────────────────────────

  getPhishingScenarios(difficulty?: Difficulty): PhishingScenario[] {
    return difficulty
      ? this.allPhishing.filter(s => s.difficulty === difficulty)
      : this.allPhishing;
  }

  getPhishingById(id: string): PhishingScenario | undefined {
    return this.allPhishing.find(s => s.id === id);
  }

  getRandomPhishingScenarios(count: number, difficulty?: Difficulty): PhishingScenario[] {
    const pool = this.getPhishingScenarios(difficulty);
    return this.shuffleAndTake(pool, count);
  }

  // ─── Quiz ─────────────────────────────────────────────────────────

  getQuizQuestions(difficulty?: Difficulty, attackType?: AttackType): QuizQuestion[] {
    let questions = this.allQuiz;
    if (difficulty)  questions = questions.filter(q => q.difficulty  === difficulty);
    if (attackType)  questions = questions.filter(q => q.attackType  === attackType);
    return questions;
  }

  getQuizById(id: string): QuizQuestion | undefined {
    return this.allQuiz.find(q => q.id === id);
  }

  getRandomQuizQuestions(
    count:       number,
    difficulty?: Difficulty,
    attackTypes?: AttackType[]
  ): QuizQuestion[] {
    let pool = this.allQuiz;
    if (difficulty)          pool = pool.filter(q => q.difficulty === difficulty);
    if (attackTypes?.length) pool = pool.filter(q => attackTypes.includes(q.attackType));
    return this.shuffleAndTake(pool, count);
  }

  // ─── Helpers ──────────────────────────────────────────────────────

  private shuffleAndTake<T>(arr: T[], count: number): T[] {
    return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
  }

  isLoaded(): boolean {
    return true;
  }
}