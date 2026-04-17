import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, doc, getDoc, getDocs,
  setDoc, deleteDoc, serverTimestamp
} from '@angular/fire/firestore';
import { PhishingScenario, QuizQuestion } from '../models/index';

@Injectable({ providedIn: 'root' })
export class AdminService {

  private firestore = inject(Firestore);

  // ─── Admin Role Check ─────────────────────────────────────────────

  async isAdmin(uid: string): Promise<boolean> {
    try {
      const ref  = doc(this.firestore, `admins/${uid}`);
      const snap = await getDoc(ref);
      return snap.exists() && snap.data()?.['role'] === 'admin';
    } catch {
      return false;
    }
  }

  // ─── Custom Phishing Scenarios ────────────────────────────────────

  async getCustomScenarios(): Promise<PhishingScenario[]> {
    try {
      const ref  = collection(this.firestore, 'custom-scenarios');
      const snap = await getDocs(ref);
      return snap.docs.map(d => ({ ...d.data(), id: d.id }) as PhishingScenario);
    } catch (err) {
      console.error('Failed to load custom scenarios:', err);
      return [];
    }
  }

  async saveCustomScenario(scenario: PhishingScenario): Promise<void> {
    const isNew = !scenario.id?.startsWith('custom-');
    const id    = isNew ? `custom-${crypto.randomUUID()}` : scenario.id;
    const ref   = doc(this.firestore, `custom-scenarios/${id}`);
    await setDoc(ref, {
      ...scenario,
      id,
      updatedAt: serverTimestamp(),
      ...(isNew && { createdAt: serverTimestamp() })
    });
  }

  async deleteCustomScenario(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, `custom-scenarios/${id}`));
  }

  // ─── Custom Quiz Questions ────────────────────────────────────────

  async getCustomQuestions(): Promise<QuizQuestion[]> {
    try {
      const ref  = collection(this.firestore, 'custom-questions');
      const snap = await getDocs(ref);
      return snap.docs.map(d => ({ ...d.data(), id: d.id }) as QuizQuestion);
    } catch (err) {
      console.error('Failed to load custom questions:', err);
      return [];
    }
  }

  async saveCustomQuestion(question: QuizQuestion): Promise<void> {
    const isNew = !question.id?.startsWith('custom-');
    const id    = isNew ? `custom-q-${crypto.randomUUID()}` : question.id;
    const ref   = doc(this.firestore, `custom-questions/${id}`);
    await setDoc(ref, {
      ...question,
      id,
      updatedAt: serverTimestamp(),
      ...(isNew && { createdAt: serverTimestamp() })
    });
  }

  async deleteCustomQuestion(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, `custom-questions/${id}`));
  }
}