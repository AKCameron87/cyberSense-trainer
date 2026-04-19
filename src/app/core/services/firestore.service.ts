import { Injectable, inject } from '@angular/core';
import {
  Firestore, doc, setDoc,
  collection, getDocs, orderBy,
  query, limit, serverTimestamp
} from '@angular/fire/firestore';
import { UserProgress } from '../models/index';

export interface LeaderboardEntry {
  id:          string;
  displayName: string;
  photoURL:    string;
  totalPoints: number;
  accuracy:    number;
  sessions:    number;
  updatedAt?:  unknown;
}

// Cache leaderboard for 60 seconds to avoid repeated Firestore reads
const LEADERBOARD_TTL_MS = 60_000;

@Injectable({ providedIn: 'root' })
export class FirestoreService {

  private firestore = inject(Firestore);

  private leaderboardCache:     LeaderboardEntry[] | null = null;
  private leaderboardCachedAt:  number = 0;

  // ─── Progress ─────────────────────────────────────────────────────

  async saveProgress(uid: string, progress: UserProgress): Promise<void> {
    const ref = doc(this.firestore, `users/${uid}/progress/data`);
    await setDoc(ref, { ...progress, updatedAt: serverTimestamp() });
  }

  // ─── Leaderboard ──────────────────────────────────────────────────

  async saveLeaderboardEntry(uid: string, entry: Omit<LeaderboardEntry, 'id' | 'updatedAt'>): Promise<void> {
    const ref = doc(this.firestore, `leaderboard/${uid}`);
    await setDoc(ref, { ...entry, updatedAt: serverTimestamp() });
    this.invalidateLeaderboardCache();
  }

  async getLeaderboard(count = 20, forceRefresh = false): Promise<LeaderboardEntry[]> {
    const cacheAge = Date.now() - this.leaderboardCachedAt;
    const cacheValid = this.leaderboardCache && cacheAge < LEADERBOARD_TTL_MS;

    if (!forceRefresh && cacheValid) {
      return this.leaderboardCache!;
    }

    try {
      const ref  = collection(this.firestore, 'leaderboard');
      const q    = query(ref, orderBy('totalPoints', 'desc'), limit(count));
      const snap = await getDocs(q);
      const entries = snap.docs.map(d => ({ id: d.id, ...d.data() }) as LeaderboardEntry);

      this.leaderboardCache    = entries;
      this.leaderboardCachedAt = Date.now();
      return entries;
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      return this.leaderboardCache ?? [];
    }
  }

  invalidateLeaderboardCache(): void {
    this.leaderboardCache    = null;
    this.leaderboardCachedAt = 0;
  }
}