import { Injectable } from '@angular/core';
import { PhishingScenario, QuizQuestion, Difficulty, AttackType } from '../models/index';

import phishingData from '../../../assets/data/phishing-scenarios.json';
import quizData from '../../../assets/data/quiz-scenarios.json';

@Injectable({ providedIn: 'root' })
export class ScenarioService {

  private phishingScenarios: PhishingScenario[] = phishingData as PhishingScenario[];
  private quizQuestions: QuizQuestion[]          = quizData as QuizQuestion[];

  async loadAll(): Promise<void> {
    // Data is already loaded via static import — nothing to do
    return Promise.resolve();
  }

  getPhishingScenarios(difficulty?: Difficulty): PhishingScenario[] {
    return difficulty
      ? this.phishingScenarios.filter(s => s.difficulty === difficulty)
      : this.phishingScenarios;
  }

  getPhishingById(id: string): PhishingScenario | undefined {
    return this.phishingScenarios.find(s => s.id === id);
  }

  getRandomPhishingScenarios(count: number, difficulty?: Difficulty): PhishingScenario[] {
    const pool = this.getPhishingScenarios(difficulty);
    return this.shuffleAndTake(pool, count);
  }

  getQuizQuestions(difficulty?: Difficulty, attackType?: AttackType): QuizQuestion[] {
    let questions = this.quizQuestions;
    if (difficulty)  questions = questions.filter(q => q.difficulty === difficulty);
    if (attackType)  questions = questions.filter(q => q.attackType === attackType);
    return questions;
  }

  getQuizById(id: string): QuizQuestion | undefined {
    return this.quizQuestions.find(q => q.id === id);
  }

  getRandomQuizQuestions(
    count: number,
    difficulty?: Difficulty,
    attackTypes?: AttackType[]
  ): QuizQuestion[] {
    let pool = this.quizQuestions;
    if (difficulty)          pool = pool.filter(q => q.difficulty === difficulty);
    if (attackTypes?.length) pool = pool.filter(q => attackTypes.includes(q.attackType));
    return this.shuffleAndTake(pool, count);
  }

  private shuffleAndTake<T>(arr: T[], count: number): T[] {
    return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
  }

  isLoaded(): boolean {
    return true;
  }
}