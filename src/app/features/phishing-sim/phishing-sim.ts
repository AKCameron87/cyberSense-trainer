import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ScenarioService }    from '../../core/services/scenario.service';
import { ProgressService }    from '../../core/services/progress.service';
import { AiScenarioService }  from '../../core/services/ai-scenario.service';
import { PhishingScenario, RedFlag, Difficulty, DIFFICULTY_CONFIGS } from '../../core/models/index';

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

  // Wrong click feedback
  wrongClickMessage:  string = '';
  showWrongFeedback:  boolean = false;
  wrongClickPenalty:  number = 25;
  totalPenalties:     number = 0;

  sessionScore     = 0;
  totalPossible    = 0;

  loading          = true;
  error            = false;
  safeBodyHtml:    SafeHtml = '';
  loadingMessage   = 'Loading scenarios...';

  private bodyClickHandler:  ((e: MouseEvent) => void) | null = null;
  private flagClickHandlers: Map<string, (e: MouseEvent) => void> = new Map();
  private renderTimeout:     ReturnType<typeof setTimeout> | null = null;
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
    const diff   = this.route.snapshot.queryParamMap.get('difficulty') as Difficulty;
    const aiMode = this.route.snapshot.queryParamMap.get('aiMode') === 'true';
    this.difficulty = diff ?? Difficulty.Rookie;

    if (aiMode) {
      this.loadingMessage = '🤖 AI is generating your scenarios...';
      this.cdr.detectChanges();
      const aiScenarios = await this.aiScenarioService.generatePhishingBatch(this.difficulty, 3);
      this.scenarios = aiScenarios.length ? aiScenarios : this.getFallbackScenarios();
    } else {
      this.scenarios = this.getFallbackScenarios();
    }

    // Set penalty based on difficulty
    this.wrongClickPenalty = this.difficulty === Difficulty.Rookie  ? 15
                           : this.difficulty === 'analyst' as Difficulty ? 25
                           : 40;

    this.totalPossible = this.scenarios.reduce((sum, s) => sum + s.totalPoints, 0);
    this.loading       = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.removeAllListeners();
    if (this.renderTimeout)     clearTimeout(this.renderTimeout);
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

    this.currentIndex    = index;
    this.currentScenario = this.scenarios[index];
    this.foundFlagIds    = [];
    this.shownFeedback   = null;
    this.showWrongFeedback = false;
    this.safeBodyHtml    = this.sanitizer.bypassSecurityTrustHtml(
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
        const target = e.target as HTMLElement;

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
      const el = document.getElementById(elementId);
      if (el) el.removeEventListener('click', handler);
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

    const target = e.target as HTMLElement;

    const matchedFlag = this.currentScenario.redFlags.find(flag => {
      const el = document.getElementById(flag.elementId);
      return el && (el === target || el.contains(target));
    });

    if (matchedFlag) {
      this.onRedFlagClick(matchedFlag);
    } else {
      // Clicked in header but not on a red flag
      this.onWrongClick(target);
    }
  }

  onRedFlagClick(flag: RedFlag): void {
    if (!this.currentScenario) return;
    if (this.foundFlagIds.includes(flag.id)) return;

    // Hide any wrong feedback if showing
    this.showWrongFeedback = false;

    this.foundFlagIds  = [...this.foundFlagIds, flag.id];
    this.shownFeedback = flag;

    const multiplier = DIFFICULTY_CONFIGS.find(
      d => d.level === this.difficulty
    )?.pointMultiplier ?? 1;
    const points = Math.round(flag.points * multiplier);
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
    // Don't penalise clicks on already-found flags or empty space
    const tagName = target.tagName.toLowerCase();
    if (['div', 'section', 'main', 'body', 'table', 'tbody', 'tr'].includes(tagName)) return;

    // Deduct points (don't go below 0)
    const penalty = this.wrongClickPenalty;
    this.sessionScore   = Math.max(0, this.sessionScore - penalty);
    this.totalPenalties += penalty;

    // Pick a random wrong-click message
    const messages = [
      `❌ That's not suspicious! -${penalty} pts`,
      `⚠️ Nothing wrong there! -${penalty} pts`,
      `🔍 Look more carefully! -${penalty} pts`,
      `❌ Not a red flag! -${penalty} pts`,
      `⚠️ That looks legitimate! -${penalty} pts`,
    ];
    this.wrongClickMessage = messages[Math.floor(Math.random() * messages.length)];

    // Dismiss correct feedback if showing
    this.shownFeedback     = null;
    this.showWrongFeedback = true;

    // Auto-dismiss after 2 seconds
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
  const multiplier = DIFFICULTY_CONFIGS.find(d => d.level === this.difficulty)?.pointMultiplier ?? 1;
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

  getDifficultyLabel(): string {
    return DIFFICULTY_CONFIGS.find(d => d.level === this.difficulty)?.label ?? 'Rookie';
  }

  getDifficultyBadgeClass(): string {
    return DIFFICULTY_CONFIGS.find(d => d.level === this.difficulty)?.badgeClass ?? 'badge-rookie';
  }

  get selectedDifficulty() {
  return DIFFICULTY_CONFIGS.find(d => d.level === this.difficulty) ?? DIFFICULTY_CONFIGS[0];
 }

}

