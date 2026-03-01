import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressService } from '../../core/services/progress.service';
import { CategoryScore, Badge } from '../../core/models/index';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.html',
  styleUrl: './results.css'
})
export class ResultsComponent implements OnInit {

  mode:         string = '';
  score:        number = 0;
  total:        number = 0;
  correct:      number = 0;
  streak:       number = 0;

  percentage:   number = 0;
  grade:        { label: string; color: string; bg: string } = { label: '', color: '', bg: '' };

  categoryScores: CategoryScore[] = [];
  newBadges:      Badge[] = [];
  weakestArea:    CategoryScore | null = null;

  readonly modeLabels: Record<string, string> = {
    'phishing-sim':    '🎣 Phishing Simulation',
    'social-eng-quiz': '🧠 Social Engineering Quiz'
  };

  constructor(
    private route:           ActivatedRoute,
    private router:          Router,
    private progressService: ProgressService
  ) {}

  ngOnInit(): void {
    const params     = this.route.snapshot.queryParamMap;
    this.mode        = params.get('mode')    ?? '';
    this.score       = Number(params.get('score'))   || 0;
    this.total       = Number(params.get('total'))   || 0;
    this.correct     = Number(params.get('correct')) || 0;
    this.streak      = Number(params.get('streak'))  || 0;

    this.percentage  = this.total > 0
      ? Math.round((this.score / this.total) * 100)
      : 0;

    this.grade       = this.getGrade(this.percentage);
    this.categoryScores = this.progressService.getUserProgress().categoryScores;
    this.newBadges   = this.progressService.getEarnedBadges().slice(-3);
    this.weakestArea = this.progressService.getWeakestCategory();
  }

  private getGrade(pct: number): { label: string; color: string; bg: string } {
    if (pct >= 90) return { label: 'Outstanding',   color: 'text-cyber-green',  bg: 'bg-cyber-green' };
    if (pct >= 75) return { label: 'Proficient',    color: 'text-cyber-accent', bg: 'bg-cyber-accent' };
    if (pct >= 60) return { label: 'Developing',    color: 'text-cyber-yellow', bg: 'bg-cyber-yellow' };
    if (pct >= 40) return { label: 'Needs Work',    color: 'text-cyber-red',    bg: 'bg-cyber-red' };
    return               { label: 'Keep Practicing', color: 'text-cyber-red',   bg: 'bg-cyber-red' };
  }

 getScorePercentage(): number {
  if (!this.total) return 0;
  return Math.min(100, Math.round((this.score / this.total) * 100));
}

  getModeLabel(): string {
    return this.modeLabels[this.mode] ?? this.mode;
  }

  getCategoryBarWidth(score: CategoryScore): number {
    return score.percentage;
  }

  getCategoryColor(score: CategoryScore): string {
    if (score.percentage >= 75) return 'bg-cyber-green';
    if (score.percentage >= 50) return 'bg-cyber-yellow';
    return 'bg-cyber-red';
  }

  playAgain(): void {
    this.router.navigate([`/${this.mode}`]);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

exportPDF(): void {
  const progress   = this.progressService.getUserProgress();
  const badges     = this.progressService.getEarnedBadges();
  const date       = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>CyberSense Training Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; color: #1a1a2e; padding: 40px; }
        .header { background: #0a0e1a; color: white; padding: 30px; margin: -40px -40px 30px; }
        .header h1 { font-size: 28px; letter-spacing: 4px; color: #00d4ff; }
        .header p { color: #8892a4; margin-top: 6px; font-size: 13px; }
        .grade-badge { display: inline-block; background: ${this.grade.bg.replace('bg-cyber-green','#00ff88').replace('bg-cyber-accent','#00d4ff').replace('bg-cyber-yellow','#ffd700').replace('bg-cyber-red','#ff4d6d')}; color: #0a0e1a; padding: 6px 20px; border-radius: 20px; font-weight: bold; font-size: 18px; margin: 20px 0; }
        .section { margin-bottom: 28px; }
        .section h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #00d4ff; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 16px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .stat-box { background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 14px; text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; color: #00d4ff; }
        .stat-label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
        .bar-row { margin-bottom: 10px; }
        .bar-label { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; }
        .bar-track { background: #e0e0e0; border-radius: 4px; height: 8px; }
        .bar-fill { height: 8px; border-radius: 4px; }
        .badge-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .badge-item { background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 10px; }
        .badge-icon { font-size: 24px; }
        .badge-name { font-weight: bold; font-size: 13px; }
        .badge-desc { font-size: 11px; color: #666; margin-top: 2px; }
        .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #e0e0e0; padding-top: 16px; }
        .score-bar-track { background: #e0e0e0; border-radius: 6px; height: 12px; margin: 8px 0; }
        .score-bar-fill { height: 12px; border-radius: 6px; background: #00d4ff; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>CYBERSENSE</h1>
        <p>Security Awareness Training Report · Generated ${date}</p>
      </div>

      <div class="section">
        <h2>Session Summary</h2>
        <p style="font-size:13px;color:#666;margin-bottom:12px;">Mode: ${this.getModeLabel()}</p>
        <div class="grade-badge">${this.grade.label}</div>
        <div class="score-bar-track">
          <div class="score-bar-fill" style="width:${this.percentage}%"></div>
        </div>
        <p style="font-size:13px;color:#666;">${this.score} out of ${this.total} possible points (${this.percentage}%)</p>
      </div>

      <div class="section">
        <h2>Performance Metrics</h2>
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-value" style="color:#00ff88">${progress.totalSessions}</div>
            <div class="stat-label">Sessions</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${progress.totalPoints}</div>
            <div class="stat-label">Total Points</div>
          </div>
          <div class="stat-box">
            <div class="stat-value" style="color:#00ff88">${progress.totalCorrect}</div>
            <div class="stat-label">Correct Answers</div>
          </div>
          <div class="stat-box">
            <div class="stat-value" style="color:#ffd700">${this.progressService.getAccuracyPercentage()}%</div>
            <div class="stat-label">Overall Accuracy</div>
          </div>
        </div>
      </div>

      ${progress.categoryScores.length ? `
      <div class="section">
        <h2>Category Breakdown</h2>
        ${progress.categoryScores.map(cat => `
          <div class="bar-row">
            <div class="bar-label">
              <span style="text-transform:capitalize">${cat.category}</span>
              <span>${cat.correct}/${cat.total} · ${cat.percentage}%</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" style="width:${cat.percentage}%;background:${cat.percentage >= 75 ? '#00ff88' : cat.percentage >= 50 ? '#ffd700' : '#ff4d6d'}"></div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      ${badges.length ? `
      <div class="section">
        <h2>Badges Earned (${badges.length})</h2>
        <div class="badge-grid">
          ${badges.map(b => `
            <div class="badge-item">
              <div class="badge-icon">${b.icon}</div>
              <div>
                <div class="badge-name">${b.label}</div>
                <div class="badge-desc">${b.description}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <div class="footer">
        CyberSense Trainer · Security Awareness Training · ${date}
      </div>
    </body>
    </html>
  `;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  }
}  

}