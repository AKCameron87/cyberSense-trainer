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

@Injectable({ providedIn: 'root' })
export class FirestoreService {

  private firestore = inject(Firestore);

  // ─── Progress ─────────────────────────────────────────────────────

  async saveProgress(uid: string, progress: UserProgress): Promise<void> {
    const ref = doc(this.firestore, `users/${uid}/progress/data`);
    await setDoc(ref, { ...progress, updatedAt: serverTimestamp() });
  }

  // ─── Leaderboard ──────────────────────────────────────────────────

  async saveLeaderboardEntry(uid: string, entry: Omit<LeaderboardEntry, 'id' | 'updatedAt'>): Promise<void> {
    const ref = doc(this.firestore, `leaderboard/${uid}`);
    await setDoc(ref, { ...entry, updatedAt: serverTimestamp() });
  }

  async getLeaderboard(count = 20): Promise<LeaderboardEntry[]> {
    try {
      const ref  = collection(this.firestore, 'leaderboard');
      const q    = query(ref, orderBy('totalPoints', 'desc'), limit(count));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }) as LeaderboardEntry);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      return [];
    }
  }
}