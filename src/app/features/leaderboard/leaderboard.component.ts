import { Component, OnInit }    from '@angular/core';
import { CommonModule }         from '@angular/common';
import { Router }               from '@angular/router';
import { FirestoreService }     from '../../core/services/firestore.service';
import { AuthService }          from '../../core/services/auth.service';

@Component({
  selector:    'app-leaderboard',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './leaderboard.html',
  styleUrl:    './leaderboard.css'
})
export class LeaderboardComponent implements OnInit {

  entries:  any[]  = [];
  loading          = true;
  currentUserRank  = 0;

  constructor(
    private firestoreService: FirestoreService,
    public  authService:      AuthService,
    private router:           Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.entries = await this.firestoreService.getLeaderboard(20);
    const uid    = this.authService.currentUser()?.uid;
    if (uid) {
      this.currentUserRank = this.entries.findIndex(e => e.id === uid) + 1;
    }
    this.loading = false;
  }

  getRankIcon(rank: number): string {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  }

  getRankClass(rank: number): string {
    if (rank === 1) return 'border-yellow-400 bg-yellow-400 bg-opacity-5';
    if (rank === 2) return 'border-gray-400 bg-gray-400 bg-opacity-5';
    if (rank === 3) return 'border-amber-600 bg-amber-600 bg-opacity-5';
    return 'border-cyber-border';
  }

  isCurrentUser(entry: any): boolean {
    return entry.id === this.authService.currentUser()?.uid;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}