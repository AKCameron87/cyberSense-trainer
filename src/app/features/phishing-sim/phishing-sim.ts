import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ScenarioService } from '../../core/services/scenario.service';
import { ProgressService } from '../../core/services/progress.service';
import { PhishingScenario, RedFlag, Difficulty, DIFFICULTY_CONFIGS } from '../../core/models/index';

@Component({
  selector: 'app-phishing-sim',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phishing-sim.html',
  styleUrl: './phishing-sim.css'
})
export class PhishingSimComponent implements OnInit {

  scenarios:       PhishingScenario[] = [];
  currentScenario: PhishingScenario | null = null;
  currentIndex     = 0;

  difficulty:      Difficulty = Difficulty.Rookie;
  sessionStarted   = false;
  sessionComplete  = false;

  foundFlagIds:    string[] = [];
  clickedWrong:    string[] = [];
  shownFeedback:   RedFlag | null = null;
  sessionScore     = 0;
  totalPossible    = 0;

  loading          = true;
  error            = false;
  safeBodyHtml:    SafeHtml = '';

  constructor(
    private scenarioService: ScenarioService,
    private progressService: ProgressService,
    private route:           ActivatedRoute,
    private router:          Router,
    private cdr:             ChangeDetectorRef,
    private sanitizer:       DomSanitizer
  ) {}

  ngOnInit(): void {
    const diff      = this.route.snapshot.queryParamMap.get('difficulty') as Difficulty;
    this.difficulty = diff ?? Difficulty.Rookie;

    const scenarios    = this.scenarioService.getRandomPhishingScenarios(6, this.difficulty);
    this.scenarios     = scenarios.length ? scenarios : this.scenarioService.getPhishingScenarios();
    this.totalPossible = this.scenarios.reduce((sum, s) => sum + s.totalPoints, 0);
    this.loading       = false;
  }

  startSession(): void {
    this.sessionStarted = true;
    this.progressService.startSession('phishing-sim', this.difficulty);
    this.loadScenario(0);
  }

  loadScenario(index: number): void {
    this.currentIndex    = index;
    this.currentScenario = this.scenarios[index];
    this.foundFlagIds    = [];
    this.clickedWrong    = [];
    this.shownFeedback   = null;
    this.safeBodyHtml    = this.sanitizer.bypassSecurityTrustHtml(
      this.currentScenario.bodyHtml
    );
    this.cdr.detectChanges();
    setTimeout(() => this.attachClickHandlers(), 150);
  }

  attachClickHandlers(): void {
    if (!this.currentScenario) return;

    // Attach handlers to all red flag elements (in body AND header)
    this.currentScenario.redFlags.forEach(flag => {
      const el = document.getElementById(flag.elementId);
      if (el) {
        el.style.cursor  = 'pointer';
        el.style.outline = '1px dashed rgba(0,212,255,0.3)';
        el.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onRedFlagClick(flag);
        });
      }
    });

    // Catch-all click handler on body
    const body = document.getElementById('scenario-body');
    if (body) {
      body.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.onBodyClick(e);
      });
    }
  }

  // Handler for clicks in the email/site header area
  onHeaderClick(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (!this.currentScenario) return;

    const target = e.target as HTMLElement;

    // Check if click landed on or inside a red flag element
    const matchedFlag = this.currentScenario.redFlags.find(flag => {
      const el = document.getElementById(flag.elementId);
      return el && (el === target || el.contains(target));
    });

    if (matchedFlag) {
      this.onRedFlagClick(matchedFlag);
    }
  }

  onRedFlagClick(flag: RedFlag): void {
    if (this.foundFlagIds.includes(flag.id)) return;

    this.foundFlagIds  = [...this.foundFlagIds, flag.id];
    this.shownFeedback = flag;

    const multiplier = DIFFICULTY_CONFIGS.find(
      d => d.level === this.difficulty
    )?.pointMultiplier ?? 1;

    this.sessionScore += Math.round(flag.points * multiplier);

    const el = document.getElementById(flag.elementId);
    if (el) {
      el.style.outline      = '2px solid #ff4444';
      el.style.borderRadius = '4px';
    }

    this.progressService.addResult({
      questionId:   `${this.currentScenario!.id}-${flag.id}`,
      correct:      true,
      pointsEarned: Math.round(flag.points * multiplier),
      timeTaken:    null
    });

    this.cdr.detectChanges();
  }

  onBodyClick(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    const target    = e.target as HTMLElement;
    const isRedFlag = this.currentScenario?.redFlags.some(
      f => {
        const el = document.getElementById(f.elementId);
        return el && (el === target || el.contains(target));
      }
    );
    if (!isRedFlag) {
      this.clickedWrong = [...this.clickedWrong, target.id || 'body'];
    }
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

  get progressPercent(): number {
    if (!this.currentScenario) return 0;
    return Math.round((this.foundFlagIds.length / this.currentScenario.redFlags.length) * 100);
  }

  nextScenario(): void {
    if (this.currentIndex < this.scenarios.length - 1) {
      this.loadScenario(this.currentIndex + 1);
    } else {
      this.completeSession();
    }
  }

  completeSession(): void {
    this.progressService.completeSession();
    this.sessionComplete = true;
    this.cdr.detectChanges();
  }

  goToResults(): void {
    this.router.navigate(['/results'], {
      queryParams: {
        mode:  'phishing-sim',
        score: this.sessionScore,
        total: this.totalPossible
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
}