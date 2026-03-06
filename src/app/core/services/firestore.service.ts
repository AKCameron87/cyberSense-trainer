import { Injectable, inject } from '@angular/core';
import {
  Firestore, doc, getDoc, setDoc,
  collection, getDocs, orderBy,
  query, limit, serverTimestamp
} from '@angular/fire/firestore';
import { UserProgress } from '../models/index';

@Injectable({ providedIn: 'root' })
export class FirestoreService {

  private firestore = inject(Firestore);

  // Save user progress to Firestore
  async saveProgress(uid: string, progress: UserProgress): Promise<void> {
    const ref = doc(this.firestore, `users/${uid}/progress/data`);
    await setDoc(ref, { ...progress, updatedAt: serverTimestamp() });
  }

  // Load user progress from Firestore
  async loadProgress(uid: string): Promise<UserProgress | null> {
    const ref  = doc(this.firestore, `users/${uid}/progress/data`);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() as UserProgress : null;
  }

  // Save leaderboard entry
  async saveLeaderboardEntry(uid: string, entry: {
    displayName: string;
    photoURL:    string;
    totalPoints: number;
    accuracy:    number;
    sessions:    number;
  }): Promise<void> {
    const ref = doc(this.firestore, `leaderboard/${uid}`);
    await setDoc(ref, { ...entry, updatedAt: serverTimestamp() });
  }

  // Get top leaderboard entries
  async getLeaderboard(count = 20): Promise<any[]> {
    const ref     = collection(this.firestore, 'leaderboard');
    const q       = query(ref, orderBy('totalPoints', 'desc'), limit(count));
    const snap    = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}