import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { Router }            from '@angular/router';
import { DIFFICULTY_CONFIGS, DifficultyConfig } from '../../core/models/index';
import { ProgressService }   from '../../core/services/progress.service';
import { AuthService }       from '../../core/services/auth.service';

@Component({
  selector:    'app-home',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './home.html',
  styleUrl:    './home.css'
})
export class HomeComponent implements OnInit {

  difficulties        = DIFFICULTY_CONFIGS;
  selectedDifficulty: DifficultyConfig = DIFFICULTY_CONFIGS[0];
  totalPoints         = 0;
  totalSessions       = 0;
  accuracy            = 0;
  aiMode              = false;

  readonly modes = [
    {
      id:          'phishing-sim',
      title:       'Phishing Simulator',
      subtitle:    'Spot the threat',
      description: 'Analyze realistic fake emails and websites. Click on suspicious elements to identify red flags before the attacker gets your credentials.',
      icon:        '🎣',
      color:       'accent',
      route:       '/phishing-sim',
      tags:        ['Email Analysis', 'Fake Sites', 'Red Flags']
    },
    {
      id:          'social-eng-quiz',
      title:       'Social Engineering Quiz',
      subtitle:    'Test your instincts',
      description: 'Face realistic attack scenarios across Phishing, Vishing, Smishing, Baiting and Pretexting. Choose the right response under pressure.',
      icon:        '🧠',
      color:       'green',
      route:       '/social-eng-quiz',
      tags:        ['Vishing', 'Smishing', 'Pretexting', 'Baiting']
    }
  ];

  constructor(
    private router:          Router,
    private progressService: ProgressService,
    public  authService:     AuthService
  ) {}

  ngOnInit(): void {
    const progress     = this.progressService.getUserProgress();
    this.totalPoints   = progress.totalPoints;
    this.totalSessions = progress.totalSessions;
    this.accuracy      = this.progressService.getAccuracyPercentage();

    if (progress.preferredDifficulty) {
      this.selectedDifficulty = DIFFICULTY_CONFIGS.find(
        d => d.level === progress.preferredDifficulty
      ) ?? DIFFICULTY_CONFIGS[0];
    }
  }

  selectDifficulty(config: DifficultyConfig): void {
    this.selectedDifficulty = config;
  }

  navigateTo(route: string): void {
    this.router.navigate([route], {
      queryParams: {
        difficulty: this.selectedDifficulty.level,
        aiMode:     this.aiMode ? 'true' : 'false'
      }
    });
  }

  toggleAiMode(): void {
    this.aiMode = !this.aiMode;
  }

  getDifficultyClass(diff: DifficultyConfig): string {
    const isActive = this.selectedDifficulty.level === diff.level;
    return isActive
      ? `diff-btn-active-${diff.level}`
      : `diff-btn-${diff.level}`;
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToLeaderboard(): void {
    this.router.navigate(['/leaderboard']);
  }

  goToAuth(): void {
    this.router.navigate(['/auth']);
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
  }
}