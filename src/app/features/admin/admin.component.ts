import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';
import { Router }                    from '@angular/router';
import { AdminService }              from '../../core/services/admin.service';
import {
  PhishingScenario, QuizQuestion,
  Difficulty, AttackType, ScenarioType
} from '../../core/models/index';

type Tab  = 'phishing' | 'quiz';
type Mode = 'list' | 'edit';

@Component({
  selector:    'app-admin',
  standalone:  true,
  imports:     [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls:   ['./admin.css']
})
export class AdminComponent implements OnInit {

  activeTab  = signal<Tab>('phishing');
  mode       = signal<Mode>('list');
  loading    = true;
  saving     = false;
  error      = '';
  success    = '';

  // ─── Phishing ────────────────────────────────────────────────────
  scenarios:       PhishingScenario[] = [];
  editingScenario: PhishingScenario   = this.blankScenario();

  // ─── Quiz ────────────────────────────────────────────────────────
  questions:       QuizQuestion[]     = [];
  editingQuestion: QuizQuestion       = this.blankQuestion();

  readonly difficulties = [Difficulty.Rookie, 'analyst' as Difficulty, Difficulty.Expert];
  readonly attackTypes  = Object.values(AttackType);

  constructor(
    private adminService: AdminService,
    private router:       Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadAll();
  }

  async loadAll(): Promise<void> {
    this.loading = true;
    try {
    console.log('Loading custom scenarios...');
    this.scenarios = await this.adminService.getCustomScenarios();
    console.log('Scenarios loaded:', this.scenarios.length);
    
    console.log('Loading custom questions...');
    this.questions = await this.adminService.getCustomQuestions();
    console.log('Questions loaded:', this.questions.length);
  } catch (err) {
    console.error('loadAll failed:', err);
    this.error = 'Failed to load data from Firestore.';
  } finally {
    this.loading = false;
    this.cdr.detectChanges();
    console.log('Loading complete, loading =', this.loading);
  }
}

  // ─── Tab & Mode ───────────────────────────────────────────────────

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
    this.mode.set('list');
    this.clearMessages();
  }

  newScenario(): void {
    this.editingScenario = this.blankScenario();
    this.mode.set('edit');
    this.clearMessages();
  }

  newQuestion(): void {
    this.editingQuestion = this.blankQuestion();
    this.mode.set('edit');
    this.clearMessages();
  }

  editScenario(scenario: PhishingScenario): void {
    this.editingScenario = { ...scenario, redFlags: scenario.redFlags.map(f => ({ ...f })) };
    this.mode.set('edit');
    this.clearMessages();
  }

  editQuestion(question: QuizQuestion): void {
    this.editingQuestion = { ...question, options: question.options.map(o => ({ ...o })) };
    this.mode.set('edit');
    this.clearMessages();
  }

  cancelEdit(): void {
    this.mode.set('list');
    this.clearMessages();
  }

  // ─── Save ─────────────────────────────────────────────────────────

  async saveScenario(): Promise<void> {
    if (!this.validateScenario()) return;
    this.saving = true;
    try {
      this.editingScenario.totalPoints = this.editingScenario.redFlags
        .reduce((sum, f) => sum + (f.points || 0), 0);
      await this.adminService.saveCustomScenario(this.editingScenario);
      this.success = 'Scenario saved successfully!';
      await this.loadAll();
      this.mode.set('list');
    } catch (err) {
      this.error = 'Failed to save scenario.';
    } finally {
      this.saving = false;
    }
  }

  async saveQuestion(): Promise<void> {
    if (!this.validateQuestion()) return;
    this.saving = true;
    try {
      await this.adminService.saveCustomQuestion(this.editingQuestion);
      this.success = 'Question saved successfully!';
      await this.loadAll();
      this.mode.set('list');
    } catch (err) {
      this.error = 'Failed to save question.';
    } finally {
      this.saving = false;
    }
  }

  // ─── Delete ───────────────────────────────────────────────────────

  async deleteScenario(id: string): Promise<void> {
    if (!confirm('Delete this scenario? This cannot be undone.')) return;
    try {
      await this.adminService.deleteCustomScenario(id);
      this.success = 'Scenario deleted.';
      await this.loadAll();
    } catch {
      this.error = 'Failed to delete scenario.';
    }
  }

  async deleteQuestion(id: string): Promise<void> {
    if (!confirm('Delete this question? This cannot be undone.')) return;
    try {
      await this.adminService.deleteCustomQuestion(id);
      this.success = 'Question deleted.';
      await this.loadAll();
    } catch {
      this.error = 'Failed to delete question.';
    }
  }

  // ─── Red Flag Helpers ─────────────────────────────────────────────

  addRedFlag(): void {
    this.editingScenario.redFlags.push({
      id:          `rf${this.editingScenario.redFlags.length + 1}`,
      elementId:   '',
      description: '',
      points:      100
    });
  }

  removeRedFlag(index: number): void {
    this.editingScenario.redFlags.splice(index, 1);
  }

  // ─── Validation ───────────────────────────────────────────────────

  private validateScenario(): boolean {
    const s = this.editingScenario;
    if (!s.title?.trim())       { this.error = 'Title is required.';        return false; }
    if (!s.subject?.trim())     { this.error = 'Subject is required.';      return false; }
    if (!s.senderEmail?.trim()) { this.error = 'Sender email is required.'; return false; }
    if (!s.bodyHtml?.trim())    { this.error = 'Email body is required.';   return false; }
    if (!s.redFlags.length)     { this.error = 'At least one red flag is required.'; return false; }
    for (const f of s.redFlags) {
      if (!f.elementId.trim() || !f.description.trim()) {
        this.error = 'All red flags must have an element ID and description.';
        return false;
      }
    }
    return true;
  }

  private validateQuestion(): boolean {
    const q = this.editingQuestion;
    if (!q.scenario?.trim())    { this.error = 'Scenario is required.';    return false; }
    if (!q.explanation?.trim()) { this.error = 'Explanation is required.'; return false; }
    if (!q.tip?.trim())         { this.error = 'Tip is required.';         return false; }
    for (const o of q.options) {
      if (!o.text.trim()) { this.error = 'All options must have text.'; return false; }
    }
    return true;
  }

  // ─── Blanks ───────────────────────────────────────────────────────

  private blankScenario(): PhishingScenario {
    return {
      id:          '',
      type:        ScenarioType.Email,       // ← use enum
      difficulty:  Difficulty.Rookie,
      title:       '',
      description: 'Identify the red flags in this email.',
      category:    'Phishing',
      explanation: '',
      subject:     '',
      senderEmail: '',
      totalPoints: 0,
      redFlags:    [
        { id: 'rf1', elementId: 'rf-sender',  description: '', points: 100 },
        { id: 'rf2', elementId: 'rf-urgency', description: '', points: 100 },
        { id: 'rf3', elementId: 'rf-link',    description: '', points: 100 },
        { id: 'rf4', elementId: 'rf-footer',  description: '', points: 100 }
      ],
      bodyHtml:    ''
    };
  }

  private blankQuestion(): QuizQuestion {
    return {
      id:          '',
      attackType:  AttackType.Phishing,
      difficulty:  Difficulty.Rookie,
      scenario:    '',
      options:     [
        { id: 'a', text: '' },
        { id: 'b', text: '' },
        { id: 'c', text: '' },
        { id: 'd', text: '' }
      ],
      correctId:   'a',
      explanation: '',
      points:      100,
      tip:         ''
    };
  }

  private clearMessages(): void {
    this.error   = '';
    this.success = '';
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}