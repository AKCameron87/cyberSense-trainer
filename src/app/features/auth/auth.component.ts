import { Component, signal, computed } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { RouterLink }    from '@angular/router';
import { Router }        from '@angular/router';
import { AuthService }   from '../../core/services/auth.service';

interface PasswordRequirement {
  label: string;
  met:   boolean;
}

@Component({
  selector:    'app-auth',
  standalone:  true,
  imports:     [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth.html',
  styleUrl:    './auth.css'
})
export class AuthComponent {

  mode        = signal<'login' | 'register'>('login');
  email       = '';
  password    = '';
  displayName = '';
  errorMessage  = '';
  loading       = false;
  showPassword  = false;

  constructor(
    private authService: AuthService,
    private router:      Router
  ) {}

  // ─── Password Policy ─────────────────────────────────────────────

  get passwordRequirements(): PasswordRequirement[] {
    return [
      { label: 'At least 16 characters',  met: this.password.length >= 16 },
      { label: 'Uppercase letter (A-Z)',   met: /[A-Z]/.test(this.password) },
      { label: 'Lowercase letter (a-z)',   met: /[a-z]/.test(this.password) },
      { label: 'Number (0-9)',             met: /[0-9]/.test(this.password) },
      { label: 'Special character (!@#…)', met: /[^A-Za-z0-9]/.test(this.password) },
    ];
  }

  get passwordValid(): boolean {
    return this.passwordRequirements.every(r => r.met);
  }

  get passwordStrength(): 'empty' | 'weak' | 'fair' | 'strong' {
    if (!this.password) return 'empty';
    const metCount = this.passwordRequirements.filter(r => r.met).length;
    if (metCount <= 1) return 'weak';
    if (metCount <= 3) return 'fair';
    return 'strong';
  }

  get strengthColor(): string {
    switch (this.passwordStrength) {
      case 'weak':   return 'bg-cyber-red';
      case 'fair':   return 'bg-cyber-yellow';
      case 'strong': return 'bg-cyber-green';
      default:       return 'bg-cyber-border';
    }
  }

  get strengthWidth(): string {
    const metCount = this.passwordRequirements.filter(r => r.met).length;
    return `${(metCount / this.passwordRequirements.length) * 100}%`;
  }

  // ─── Auth Actions ─────────────────────────────────────────────────

  async signInWithGoogle(): Promise<void> {
    try {
      this.loading = true;
      await this.authService.signInWithGoogle();
      this.router.navigate(['/']);
    } catch (e: any) {
      this.errorMessage = e.message;
    } finally {
      this.loading = false;
    }
  }

  async signInWithEmail(): Promise<void> {
    try {
      this.loading = true;
      await this.authService.signInWithEmail(this.email, this.password);
      this.router.navigate(['/']);
    } catch (e: any) {
      this.errorMessage = this.getFriendlyError(e.code);
    } finally {
      this.loading = false;
    }
  }

  async register(): Promise<void> {
    // Validate password policy before hitting Firebase
    if (!this.passwordValid) {
      this.errorMessage = 'Please meet all password requirements before registering.';
      return;
    }

    try {
      this.loading = true;
      await this.authService.registerWithEmail(this.email, this.password, this.displayName);
      this.router.navigate(['/']);
    } catch (e: any) {
      this.errorMessage = this.getFriendlyError(e.code);
    } finally {
      this.loading = false;
    }
  }

  getFriendlyError(code: string): string {
    const errors: Record<string, string> = {
      'auth/email-already-in-use':  'An account with this email already exists.',
      'auth/invalid-email':         'Please enter a valid email address.',
      'auth/weak-password':         'Password must meet the complexity requirements.',
      'auth/user-not-found':        'No account found with this email.',
      'auth/wrong-password':        'Incorrect password.',
      'auth/invalid-credential':    'Invalid email or password.',
      'auth/password-does-not-meet-requirements': 'Password does not meet the security requirements.',
    };
    return errors[code] ?? 'Something went wrong. Please try again.';
  }

  toggleMode(): void {
    this.mode.set(this.mode() === 'login' ? 'register' : 'login');
    this.errorMessage = '';
    this.password     = '';
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}