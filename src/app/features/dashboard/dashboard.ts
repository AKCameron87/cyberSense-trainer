import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { Router }            from '@angular/router';
import { ProgressService }   from '../../core/services/progress.service';
import { UserProgress, Badge, CategoryScore, GameSession } from '../../core/models/index';

@Component({
  selector:    'app-dashboard',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl:    './dashboard.css'
})
export class DashboardComponent implements OnInit {

  progress!:      UserProgress;
  earnedBadges:   Badge[]       = [];
  lockedBadges:   Badge[]       = [];
  recentSessions: GameSession[] = [];
  weakestArea:    CategoryScore | null = null;
  accuracy       = 0;

  constructor(
    private progressService: ProgressService,
    private router:          Router
  ) {}

  ngOnInit(): void {
    this.progress       = this.progressService.getUserProgress();
    this.earnedBadges   = this.progressService.getEarnedBadges();
    this.lockedBadges   = this.progress.badges.filter(b => !b.earnedAt);
    this.accuracy       = this.progressService.getAccuracyPercentage();
    this.weakestArea    = this.progressService.getWeakestCategory();
    this.recentSessions = this.progressService.getAllSessions().slice(-5).reverse();
  }

  getAccuracyColor(): string {
    if (this.accuracy >= 75) return 'text-cyber-green';
    if (this.accuracy >= 50) return 'text-cyber-yellow';
    return 'text-cyber-red';
  }

  getCategoryColor(score: CategoryScore): string {
    if (score.percentage >= 75) return 'bg-cyber-green';
    if (score.percentage >= 50) return 'bg-cyber-yellow';
    return 'bg-cyber-red';
  }

  getSessionIcon(mode: string): string {
    return mode === 'phishing-sim' ? '🎣' : '🧠';
  }

  getSessionLabel(mode: string): string {
    return mode === 'phishing-sim' ? 'Phishing Sim' : 'Social Eng Quiz';
  }

  getSessionStatus(session: GameSession): { label: string; color: string } {
    return session.passed
      ? { label: '✅ Passed', color: 'text-cyber-green' }
      : { label: '❌ Failed', color: 'text-cyber-red'   };
  }

  formatDate(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  hasPlayed(): boolean {
    return this.progress.totalSessions > 0;
  }

  resetProgress(): void {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      this.progressService.resetProgress();
      this.router.navigate(['/']);
    }
  }

  goHome():      void { this.router.navigate(['/']);               }
  playPhishing():void { this.router.navigate(['/phishing-sim']);   }
  playQuiz():    void { this.router.navigate(['/social-eng-quiz']); }
}