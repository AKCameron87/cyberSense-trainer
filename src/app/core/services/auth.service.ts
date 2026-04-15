import { Injectable, inject, signal, runInInjectionContext, Injector } from '@angular/core';
import {
  Auth, GoogleAuthProvider, User,
  signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut,
  onAuthStateChanged, updateProfile
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  public auth    = inject(Auth);
  private injector = inject(Injector);

  currentUser = signal<User | null>(null);
  loading     = signal(true);

  constructor() {
    // Run inside injection context to avoid Angular zone warning
    runInInjectionContext(this.injector, () => {
      onAuthStateChanged(this.auth, user => {
        this.currentUser.set(user);
        this.loading.set(false);
      });
    });
  }

  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async registerWithEmail(email: string, password: string, displayName: string): Promise<void> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(cred.user, { displayName });
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  get userDisplayName(): string {
    return this.currentUser()?.displayName ?? this.currentUser()?.email ?? 'Trainer';
  }

  get userEmail(): string {
    return this.currentUser()?.email ?? '';
  }

  get userPhotoURL(): string {
    return this.currentUser()?.photoURL ?? '';
  }
}