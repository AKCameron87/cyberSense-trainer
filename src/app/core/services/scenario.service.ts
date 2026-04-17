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

  // Cached merged arrays — rebuilt once after custom load
  private _allPhishing: PhishingScenario[] = [...this.staticPhishing];
  private _allQuiz:     QuizQuestion[]     = [...this.staticQuiz];

  constructor(private adminService: AdminService) {}

  // ─── Load custom scenarios from Firestore ────────────────────────

  async loadCustomScenarios(): Promise<void> {
    if (this.customLoaded) return;
    try {
      this.customPhishing = await this.adminService.getCustomScenarios();
      this.customQuiz     = await this.adminService.getCustomQuestions();
      this.customLoaded   = true;

      // Rebuild merged arrays once after load
      this._allPhishing = [...this.staticPhishing, ...this.customPhishing];
      this._allQuiz     = [...this.staticQuiz,     ...this.customQuiz];
    } catch (err) {
      console.warn('Could not load custom scenarios from Firestore:', err);
    }
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