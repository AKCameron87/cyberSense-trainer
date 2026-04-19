import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ScenarioService }   from '../../core/services/scenario.service';
import { ProgressService }   from '../../core/services/progress.service';
import { AiScenarioService } from '../../core/services/ai-scenario.service';
import { PhishingScenario, RedFlag, Difficulty, DIFFICULTY_CONFIGS, DifficultyConfig } from '../../core/models/index';

@Component({
  selector:    'app-phishing-sim',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './phishing-sim.html',
  styleUrl:    './phishing-sim.css'
})
export class PhishingSimComponent implements OnInit, OnDestroy {

  scenarios:       PhishingScenario[] = [];
  currentScenario: PhishingScenario | null = null;
  currentIndex     = 0;

  difficulty:      Difficulty = Difficulty.Rookie;
  sessionStarted   = false;
  sessionComplete  = false;

  foundFlagIds:    string[] = [];
  shownFeedback:   RedFlag | null = null;

  wrongClickMessage  = '';
  showWrongFeedback  = false;
  wrongClickPenalty  = 25;
  totalPenalties     = 0;

  sessionScore       = 0;
  totalPossible      = 0;

  loading            = true;
  safeBodyHtml:      SafeHtml = '';
  loadingMessage     = 'Loading scenarios...';

  // Cached difficulty config — set once in ngOnInit
  private difficultyConfig!: DifficultyConfig;

  private readonly WRONG_CLICK_MESSAGES = [
    `❌ That's not suspicious!`,
    `⚠️ Nothing wrong there!`,
    `🔍 Look more carefully!`,
    `❌ Not a red flag!`,
    `⚠️ That looks legitimate!`,
  ];

  private bodyClickHandler:   ((e: MouseEvent) => void) | null = null;
  private flagClickHandlers:  Map<string, (e: MouseEvent) => void> = new Map();
  private renderTimeout:      ReturnType<typeof setTimeout> | null = null;
  private wrongFeedbackTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private scenarioService:   ScenarioService,
    private progressService:   ProgressService,
    private aiScenarioService: AiScenarioService,
    private route:             ActivatedRoute,
    private router:            Router,
    private cdr:               ChangeDetectorRef,
    private sanitizer:         DomSanitizer
  ) {}

  async ngOnInit(): Promise<void> {
    await this.scenarioService.loadAll();

    const diff   = this.route.snapshot.queryParamMap.get('difficulty') as Difficulty;
    const aiMode = this.route.snapshot.queryParamMap.get('aiMode') === 'true';
    this.difficulty       = diff ?? Difficulty.Rookie;
    this.difficultyConfig = DIFFICULTY_CONFIGS.find(d => d.level === this.difficulty)
      ?? DIFFICULTY_CONFIGS[0];

    this.wrongClickPenalty = this.difficultyConfig.level === Difficulty.Rookie  ? 15
                           : this.difficultyConfig.level === Difficulty.Analyst ? 25
                           : 40;

    if (aiMode) {
      this.loadingMessage = '🤖 AI is generating your scenarios...';
      this.cdr.detectChanges();
      const aiScenarios = await this.aiScenarioService.generatePhishingBatch(this.difficulty, 3);
      this.scenarios = aiScenarios.length ? aiScenarios : this.getFallbackScenarios();
    } else {
      this.scenarios = this.getFallbackScenarios();
    }

    this.totalPossible = this.scenarios.reduce((sum, s) => sum + s.totalPoints, 0);
    this.loading       = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.removeAllListeners();
    if (this.renderTimeout)      clearTimeout(this.renderTimeout);
    if (this.wrongFeedbackTimer) clearTimeout(this.wrongFeedbackTimer);
  }

  private getFallbackScenarios(): PhishingScenario[] {
    const scenarios = this.scenarioService.getRandomPhishingScenarios(6, this.difficulty);
    return scenarios.length ? scenarios : this.scenarioService.getPhishingScenarios();
  }

  startSession(): void {
    this.sessionStarted = true;
    this.progressService.startSession('phishing-sim', this.difficulty);
    this.loadScenario(0);
  }

  loadScenario(index: number): void {
    this.removeAllListeners();

    this.currentIndex      = index;
    this.currentScenario   = this.scenarios[index];
    this.foundFlagIds      = [];
    this.shownFeedback     = null;
    this.showWrongFeedback = false;
    this.safeBodyHtml      = this.sanitizer.bypassSecurityTrustHtml(
      this.currentScenario.bodyHtml
    );

    this.cdr.detectChanges();

    if (this.renderTimeout) clearTimeout(this.renderTimeout);
    this.renderTimeout = setTimeout(() => this.attachClickHandlers(), 300);
  }

  private attachClickHandlers(): void {
    if (!this.currentScenario) return;

    this.currentScenario.redFlags.forEach(flag => {
      const el = document.getElementById(flag.elementId);
      if (el) {
        el.style.cursor       = 'pointer';
        el.style.outline      = '1px dashed rgba(0,212,255,0.4)';
        el.style.borderRadius = '3px';
        el.style.transition   = 'outline 0.2s ease';

        const handler = (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          this.onRedFlagClick(flag);
        };

        this.flagClickHandlers.set(flag.elementId, handler);
        el.addEventListener('click', handler);
      }
    });

    const body = document.getElementById('scenario-body');
    if (body) {
      this.bodyClickHandler = (e: MouseEvent) => {
        const target    = e.target as HTMLElement;
        const isRedFlag = this.currentScenario?.redFlags.some(f => {
          const el = document.getElementById(f.elementId);
          return el && (el === target || el.contains(target));
        });

        if (!isRedFlag) {
          e.preventDefault();
          e.stopPropagation();
          this.onWrongClick(target);
        }
      };
      body.addEventListener('click', this.bodyClickHandler);
    }
  }

  private removeAllListeners(): void {
    this.flagClickHandlers.forEach((handler, elementId) => {
      document.getElementById(elementId)?.removeEventListener('click', handler);
    });
    this.flagClickHandlers.clear();

    const body = document.getElementById('scenario-body');
    if (body && this.bodyClickHandler) {
      body.removeEventListener('click', this.bodyClickHandler);
      this.bodyClickHandler = null;
    }
  }

  onHeaderClick(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (!this.currentScenario) return;

    const target      = e.target as HTMLElement;
    const matchedFlag = this.currentScenario.redFlags.find(flag => {
      const el = document.getElementById(flag.elementId);
      return el && (el === target || el.contains(target));
    });

    if (matchedFlag) {
      this.onRedFlagClick(matchedFlag);
    } else {
      this.onWrongClick(target);
    }
  }

  onRedFlagClick(flag: RedFlag): void {
    if (!this.currentScenario) return;
    if (this.foundFlagIds.includes(flag.id)) return;

    this.showWrongFeedback = false;
    this.foundFlagIds      = [...this.foundFlagIds, flag.id];
    this.shownFeedback     = flag;

    const points = Math.round(flag.points * this.difficultyConfig.pointMultiplier);
    this.sessionScore += points;

    const el = document.getElementById(flag.elementId);
    if (el) {
      el.style.outline      = '2px solid #ff4444';
      el.style.borderRadius = '4px';
      el.style.cursor       = 'default';
    }

    this.progressService.addResult({
      questionId:   `${this.currentScenario.id}-${flag.id}`,
      correct:      true,
      pointsEarned: points,
      timeTaken:    null
    });

    this.cdr.detectChanges();
  }

  onWrongClick(target: HTMLElement): void {
    const tagName = target.tagName.toLowerCase();
    if (['div', 'section', 'main', 'body', 'table', 'tbody', 'tr'].includes(tagName)) return;

    const penalty       = this.wrongClickPenalty;
    this.sessionScore   = Math.max(0, this.sessionScore - penalty);
    this.totalPenalties += penalty;

    const base = this.WRONG_CLICK_MESSAGES[
      Math.floor(Math.random() * this.WRONG_CLICK_MESSAGES.length)
    ];
    this.wrongClickMessage = `${base} -${penalty} pts`;
    this.shownFeedback     = null;
    this.showWrongFeedback = true;

    if (this.wrongFeedbackTimer) clearTimeout(this.wrongFeedbackTimer);
    this.wrongFeedbackTimer = setTimeout(() => {
      this.showWrongFeedback = false;
      this.cdr.detectChanges();
    }, 2000);

    this.cdr.detectChanges();
  }

  dismissFeedback(): void {
    this.shownFeedback = null;
    this.cdr.detectChanges();
  }

  get allFlagsFound(): boolean {
    return this.currentScenario
      ? this.foundFlagIds.length >= this.currentScenario.redFlags.length
      : false;
  }

  get selectedDifficulty(): DifficultyConfig {
    return this.difficultyConfig ?? DIFFICULTY_CONFIGS[0];
  }

  get difficultyLabel(): string {
    return this.difficultyConfig?.label ?? 'Rookie';
  }

  get difficultyBadgeClass(): string {
    return this.difficultyConfig?.badgeClass ?? 'badge-rookie';
  }

  nextScenario(): void {
    if (this.currentIndex < this.scenarios.length - 1) {
      this.loadScenario(this.currentIndex + 1);
    } else {
      this.completeSession();
    }
  }

  completeSession(): void {
    this.removeAllListeners();
    this.progressService.completeSession();
    this.sessionComplete = true;
    this.cdr.detectChanges();
  }

  goToResults(): void {
    const multiplier = this.difficultyConfig.pointMultiplier;
    const baseScore  = multiplier > 1 ? Math.round(this.sessionScore / multiplier) : this.sessionScore;

    this.router.navigate(['/results'], {
      queryParams: {
        mode:      'phishing-sim',
        score:     this.sessionScore,
        baseScore,
        total:     this.totalPossible,
        multiplier
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}