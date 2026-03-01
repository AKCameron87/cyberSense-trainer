import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ScenarioService } from '../../core/services/scenario.service';
import { ProgressService } from '../../core/services/progress.service';
import {
  QuizQuestion, Difficulty, AttackType, DIFFICULTY_CONFIGS
} from '../../core/models/index';

@Component({
  selector: 'app-social-eng-quiz',
  imports: [CommonModule],
  templateUrl: './social-eng-quiz.html',
  styleUrl: './social-eng-quiz.css',
})
export class SocialEngQuizComponent implements OnInit {

  questions:       QuizQuestion[] = [];
  currentQuestion: QuizQuestion | null = null;
  currentIndex     = 0;

  difficulty:      Difficulty = Difficulty.Rookie;
  sessionStarted   = false;
  sessionComplete  = false;

  selectedAnswer:  string | null = null;
  answerSubmitted  = false;
  isCorrect:       boolean | null = null;

  sessionScore     = 0;
  totalPossible    = 0;
  correctCount     = 0;
  streak           = 0;
  bestStreak       = 0;

  timeLeft:        number | null = null;
  timerInterval:   any = null;
  timerExpired     = false;

  loading          = true;
  error            = false;

  readonly attackTypeLabels: Record<string, string> = {
    phishing:   '🎣 Phishing',
    vishing:    '📞 Vishing',
    smishing:   '💬 Smishing',
    baiting:    '🪤 Baiting',
    pretexting: '🎭 Pretexting'
  };

  constructor(
    private scenarioService: ScenarioService,
    private progressService: ProgressService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
async ngOnInit(): Promise<void> {
  const diff      = this.route.snapshot.queryParamMap.get('difficulty') as Difficulty;
  this.difficulty = diff ?? Difficulty.Rookie;

  this.questions = this.scenarioService.getRandomQuizQuestions(10, this.difficulty);
  if (!this.questions.length) {
    this.questions = this.scenarioService.getRandomQuizQuestions(10);
  }

  this.totalPossible = this.questions.reduce((sum, q) => sum + q.points, 0);
  this.loading       = false;
  this.cdr.detectChanges();
}

  startSession(): void {
    this.sessionStarted = true;
    this.progressService.startSession('social-eng-quiz', this.difficulty);
    this.loadQuestion(0);
  }

  loadQuestion(index: number): void {
    this.clearTimer();
    this.currentIndex    = index;
    this.currentQuestion = this.questions[index];
    this.selectedAnswer  = null;
    this.answerSubmitted = false;
    this.isCorrect       = null;
    this.timerExpired    = false;
    this.cdr.detectChanges();

    const config = DIFFICULTY_CONFIGS.find(d => d.level === this.difficulty);
    if (config?.timerSeconds) {
      this.startTimer(config.timerSeconds);
    }
  }

  startTimer(seconds: number): void {
    this.timeLeft = seconds;
    this.timerInterval = setInterval(() => {
      if (this.timeLeft !== null && this.timeLeft > 0) {
        this.timeLeft--;
        this.cdr.detectChanges();
      } else {
        this.onTimerExpired();
      }
    }, 1000);
  }

  onTimerExpired(): void {
    this.clearTimer();
    this.timerExpired    = true;
    this.answerSubmitted = true;
    this.isCorrect       = false;
    this.streak          = 0;

    this.progressService.addResult({
      questionId:   this.currentQuestion!.id,
      correct:      false,
      pointsEarned: 0,
      timeTaken:    DIFFICULTY_CONFIGS.find(d => d.level === this.difficulty)?.timerSeconds ?? null
    });

    this.cdr.detectChanges();
  }

  clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timeLeft = null;
  }

  selectAnswer(optionId: string): void {
    if (this.answerSubmitted) return;
    this.selectedAnswer = optionId;
    this.cdr.detectChanges();
  }

  submitAnswer(): void {
    if (!this.selectedAnswer || !this.currentQuestion || this.answerSubmitted) return;

    this.clearTimer();
    this.answerSubmitted = true;
    this.isCorrect       = this.selectedAnswer === this.currentQuestion.correctId;

    const config     = DIFFICULTY_CONFIGS.find(d => d.level === this.difficulty);
    const multiplier = config?.pointMultiplier ?? 1;
    const timeTaken  = config?.timerSeconds
      ? config.timerSeconds - (this.timeLeft ?? 0)
      : null;

    if (this.isCorrect) {
      this.streak++;
      this.bestStreak  = Math.max(this.streak, this.bestStreak);
      this.correctCount++;
      const earned     = Math.round(this.currentQuestion.points * multiplier);
      this.sessionScore += earned;

      this.progressService.addResult({
        questionId:   this.currentQuestion.id,
        correct:      true,
        pointsEarned: earned,
        timeTaken
      });
    } else {
      this.streak = 0;
      this.progressService.addResult({
        questionId:   this.currentQuestion.id,
        correct:      false,
        pointsEarned: 0,
        timeTaken
      });
    }

    this.cdr.detectChanges();
  }

  nextQuestion(): void {
    if (this.currentIndex < this.questions.length - 1) {
      this.loadQuestion(this.currentIndex + 1);
    } else {
      this.completeSession();
    }
  }

  completeSession(): void {
    this.clearTimer();
    this.progressService.completeSession();
    this.sessionComplete = true;
    this.cdr.detectChanges();
  }

  getOptionClass(optionId: string): string {
    if (!this.answerSubmitted) {
      return this.selectedAnswer === optionId
        ? 'option-selected'
        : 'option-default';
    }
    if (optionId === this.currentQuestion?.correctId) return 'option-correct';
    if (optionId === this.selectedAnswer)              return 'option-wrong';
    return 'option-default option-dimmed';
  }

  getTimerClass(): string {
    if (this.timeLeft === null) return '';
    if (this.timeLeft <= 5)    return 'timer-danger';
    if (this.timeLeft <= 10)   return 'timer-warning';
    return 'timer-safe';
  }

  getAttackTypeLabel(type: string): string {
    return this.attackTypeLabels[type] ?? type;
  }

getScorePercentage(): number {
  if (!this.totalPossible) return 0;
  return Math.min(100, Math.round((this.sessionScore / this.totalPossible) * 100));
}

  getGrade(): { label: string; color: string } {
    const pct = this.getScorePercentage();
    if (pct >= 90) return { label: 'Expert',      color: 'text-cyber-green' };
    if (pct >= 70) return { label: 'Proficient',  color: 'text-cyber-accent' };
    if (pct >= 50) return { label: 'Developing',  color: 'text-cyber-yellow' };
    return          { label: 'Needs Practice',    color: 'text-cyber-red' };
  }

  getDifficultyLabel(): string {
    return DIFFICULTY_CONFIGS.find(d => d.level === this.difficulty)?.label ?? 'Rookie';
  }

  getDifficultyBadgeClass(): string {
    return DIFFICULTY_CONFIGS.find(d => d.level === this.difficulty)?.badgeClass ?? 'badge-rookie';
  }

  goToResults(): void {
    this.router.navigate(['/results'], {
      queryParams: {
        mode:    'social-eng-quiz',
        score:   this.sessionScore,
        total:   this.totalPossible,
        correct: this.correctCount,
        streak:  this.bestStreak
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}