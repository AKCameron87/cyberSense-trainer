import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ScenarioService }   from '../../core/services/scenario.service';
import { ProgressService }   from '../../core/services/progress.service';
import { AiScenarioService } from '../../core/services/ai-scenario.service';
import {
  QuizQuestion, Difficulty, DIFFICULTY_CONFIGS, DifficultyConfig
} from '../../core/models/index';

interface ShuffledOption {
  id:       string;
  text:     string;
  original: string;
}

@Component({
  selector:    'app-social-eng-quiz',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './social-eng-quiz.html',
  styleUrl:    './social-eng-quiz.css',
})
export class SocialEngQuizComponent implements OnInit, OnDestroy {

  questions:         QuizQuestion[]   = [];
  currentQuestion:   QuizQuestion | null = null;
  shuffledOptions:   ShuffledOption[] = [];
  correctShuffledId  = '';
  currentIndex       = 0;

  difficulty:        Difficulty = Difficulty.Rookie;
  sessionStarted     = false;
  sessionComplete    = false;

  selectedAnswer:    string | null = null;
  answerSubmitted    = false;
  isCorrect:         boolean | null = null;

  sessionScore       = 0;
  totalPossible      = 0;
  correctCount       = 0;
  streak             = 0;
  bestStreak         = 0;

  timeLeft:          number | null = null;
  timerExpired       = false;
  loading            = true;
  loadingMessage     = 'Loading questions...';

  // Cached difficulty config — set once in ngOnInit
  private difficultyConfig!: DifficultyConfig;
  private timerInterval:     ReturnType<typeof setInterval> | null = null;

  readonly attackTypeLabels: Record<string, string> = {
    phishing:   '🎣 Phishing',
    vishing:    '📞 Vishing',
    smishing:   '💬 Smishing',
    baiting:    '🪤 Baiting',
    pretexting: '🎭 Pretexting'
  };

  constructor(
    private scenarioService:   ScenarioService,
    private progressService:   ProgressService,
    private aiScenarioService: AiScenarioService,
    private route:             ActivatedRoute,
    private router:            Router,
    private cdr:               ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.scenarioService.loadCustomScenarios();

    const diff   = this.route.snapshot.queryParamMap.get('difficulty') as Difficulty;
    const aiMode = this.route.snapshot.queryParamMap.get('aiMode') === 'true';
    this.difficulty       = diff ?? Difficulty.Rookie;
    this.difficultyConfig = DIFFICULTY_CONFIGS.find(d => d.level === this.difficulty)
      ?? DIFFICULTY_CONFIGS[0];

    if (aiMode) {
      this.loadingMessage = '🤖 AI is generating your questions...';
      this.cdr.detectChanges();
      const aiQuestions = await this.aiScenarioService.generateQuizBatch(this.difficulty, 5);
      this.questions = aiQuestions.length ? aiQuestions : this.getFallbackQuestions();
    } else {
      this.questions = this.getFallbackQuestions();
    }

    this.questions     = this.shuffleArray(this.questions);
    this.totalPossible = this.questions.reduce((sum, q) => sum + q.points, 0);
    this.loading       = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private getFallbackQuestions(): QuizQuestion[] {
    const questions = this.scenarioService.getRandomQuizQuestions(10, this.difficulty);
    return questions.length ? questions : this.scenarioService.getRandomQuizQuestions(10);
  }

  private shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  private buildShuffledOptions(question: QuizQuestion): void {
    const labels   = ['a', 'b', 'c', 'd'];
    const shuffled = this.shuffleArray(question.options.map(o => ({ ...o, original: o.id })));

    this.shuffledOptions = shuffled.map((opt, i) => ({
      id:       labels[i],
      text:     opt.text,
      original: opt.original
    }));

    this.correctShuffledId = this.shuffledOptions.find(
      o => o.original === question.correctId
    )?.id ?? question.correctId;
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

    this.buildShuffledOptions(this.currentQuestion);
    this.cdr.detectChanges();

    if (this.difficultyConfig.timerSeconds) {
      this.startTimer(this.difficultyConfig.timerSeconds);
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
      timeTaken:    this.difficultyConfig.timerSeconds ?? null,
      category:     this.currentQuestion?.attackType
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
    this.isCorrect       = this.selectedAnswer === this.correctShuffledId;

    const timeTaken = this.difficultyConfig.timerSeconds
      ? this.difficultyConfig.timerSeconds - (this.timeLeft ?? 0)
      : null;

    let pointsEarned = 0;
    if (this.isCorrect) {
      this.streak++;
      this.bestStreak   = Math.max(this.streak, this.bestStreak);
      this.correctCount++;
      pointsEarned      = Math.round(this.currentQuestion.points * this.difficultyConfig.pointMultiplier);
      this.sessionScore += pointsEarned;
    } else {
      this.streak = 0;
    }

    this.progressService.addResult({
      questionId:   this.currentQuestion.id,
      correct:      this.isCorrect,
      pointsEarned,
      timeTaken,
      category:     this.currentQuestion.attackType
    });

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
      return this.selectedAnswer === optionId ? 'option-selected' : 'option-default';
    }
    if (optionId === this.correctShuffledId) return 'option-correct';
    if (optionId === this.selectedAnswer)    return 'option-wrong';
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
    if (pct >= 90) return { label: 'Expert',       color: 'text-cyber-green'  };
    if (pct >= 70) return { label: 'Proficient',   color: 'text-cyber-accent' };
    if (pct >= 50) return { label: 'Developing',   color: 'text-cyber-yellow' };
    return          { label: 'Needs Practice',     color: 'text-cyber-red'    };
  }

  get difficultyLabel(): string {
    return this.difficultyConfig?.label ?? 'Rookie';
  }

  get difficultyBadgeClass(): string {
    return this.difficultyConfig?.badgeClass ?? 'badge-rookie';
  }

  get currentTip(): string {
    return this.currentQuestion?.tip ?? '';
  }

  goToResults(): void {
    const multiplier = this.difficultyConfig.pointMultiplier;
    const baseScore  = multiplier > 1 ? Math.round(this.sessionScore / multiplier) : this.sessionScore;

    this.router.navigate(['/results'], {
      queryParams: {
        mode:       'social-eng-quiz',
        score:      this.sessionScore,
        baseScore,
        total:      this.totalPossible,
        correct:    this.correctCount,
        streak:     this.bestStreak,
        multiplier
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}