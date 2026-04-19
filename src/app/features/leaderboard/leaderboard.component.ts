import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { Router }          from '@angular/router';
import { FirestoreService, LeaderboardEntry } from '../../core/services/firestore.service';
import { AuthService }     from '../../core/services/auth.service';

@Component({
  selector:    'app-leaderboard',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './leaderboard.html',
  styleUrl:    './leaderboard.css'
})
export class LeaderboardComponent implements OnInit {

  entries:         LeaderboardEntry[] = [];
  loading          = true;
  currentUserRank  = 0;
  currentUserUid   = '';

  constructor(
    private firestoreService: FirestoreService,
    private authService:      AuthService,
    private router:           Router,
    private cdr:              ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentUserUid = this.authService.currentUser()?.uid ?? '';
    this.entries        = await this.firestoreService.getLeaderboard(20);

    if (this.currentUserUid) {
      const idx            = this.entries.findIndex(e => e.id === this.currentUserUid);
      this.currentUserRank = idx >= 0 ? idx + 1 : 0;
    }

    this.loading = false;
    this.cdr.detectChanges();
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

  isCurrentUser(entry: LeaderboardEntry): boolean {
    return entry.id === this.currentUserUid;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}