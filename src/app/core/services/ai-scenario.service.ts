import { Injectable } from '@angular/core';
import { PhishingScenario, QuizQuestion, Difficulty, AttackType } from '../models/index';

@Injectable({ providedIn: 'root' })
export class AiScenarioService {

  private readonly API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3001/v1/messages'
    : 'https://us-central1-cybersense-trainer.cloudfunctions.net/anthropicProxy';

  private readonly MODEL = 'claude-sonnet-4-20250514';

  private readonly PHISHING_SEEDS = [
    'a fake bank security alert',
    'a fake package delivery notice',
    'a fake IT helpdesk password reset',
    'a fake invoice from a vendor',
    'a fake HR benefits update',
    'a fake cloud storage sharing request',
    'a fake tax refund notification',
    'a fake subscription renewal',
    'a fake executive request for urgent wire transfer',
    'a fake government compliance notice',
    'a fake software license expiry warning',
    'a fake prize or lottery win notification'
  ];

  // ─── Shared API Helper ────────────────────────────────────────────

  private async callApi<T>(prompt: string, maxTokens: number): Promise<T | null> {
    try {
      const response = await fetch(this.API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          model:      this.MODEL,
          max_tokens: maxTokens,
          messages:   [{ role: 'user', content: prompt }]
        })
      });

      const data  = await response.json();
      const text  = data.content?.[0]?.text ?? '';
      const clean = text.replace(/```json|```/g, '').trim();
      return JSON.parse(clean) as T;
    } catch (err) {
      console.error('AI API call failed:', err);
      return null;
    }
  }

  // ─── Phishing Scenario Generation ────────────────────────────────

  async generatePhishingScenario(
    difficulty: Difficulty,
    usedTitles: string[] = []
  ): Promise<PhishingScenario | null> {
    const seed      = this.PHISHING_SEEDS[Math.floor(Math.random() * this.PHISHING_SEEDS.length)];
    const avoidList = usedTitles.length
      ? `\nDo NOT repeat any of these already-used scenarios: ${usedTitles.join('; ')}.\nYour scenario MUST be on a completely different topic, brand, and attack vector.`
      : '';

    const prompt = `You are generating a phishing simulation scenario for a cybersecurity training application.

Difficulty: ${difficulty}
Topic seed (use this as inspiration): ${seed}
${avoidList}

Return ONLY a valid JSON object with EXACTLY this structure — no markdown, no explanation, no code fences:

{
  "id": "ai-p-001",
  "type": "email",
  "difficulty": "${difficulty}",
  "title": "Short descriptive title (different from the seed, be creative)",
  "description": "One sentence instruction for the trainee",
  "explanation": "One sentence explaining the main phishing technique used",
  "category": "Phishing",
  "subject": "Realistic email subject line",
  "senderEmail": "fake@suspicious-domain.com",
  "totalPoints": 400,
  "redFlags": [
    {
      "id": "rf1",
      "elementId": "rf-sender",
      "description": "Explain exactly why the sender address is suspicious",
      "points": 100
    },
    {
      "id": "rf2",
      "elementId": "rf-urgency",
      "description": "Explain the urgency or pressure tactic used",
      "points": 100
    },
    {
      "id": "rf3",
      "elementId": "rf-link",
      "description": "Explain why the link or button is suspicious",
      "points": 100
    },
    {
      "id": "rf4",
      "elementId": "rf-footer",
      "description": "Explain the suspicious footer or branding element",
      "points": 100
    }
  ],
  "bodyHtml": "FULL HTML EMAIL BODY HERE"
}

bodyHtml requirements:
- Must be realistic, well-formatted HTML that looks like a genuine company email
- Must contain elements with EXACTLY these id attributes: rf-sender, rf-urgency, rf-link, rf-footer
- Difficulty rookie = obvious red flags (misspellings, obvious fake domains)
- Difficulty analyst = subtle red flags (slightly off branding, minor domain issues)
- Difficulty expert = very convincing (nearly identical to real emails, very subtle flaws)
- Use inline styles to make it look professional
- The HTML should be a complete email body div, not a full HTML document`;

    const scenario = await this.callApi<PhishingScenario>(prompt, 3000);
    if (!scenario) return null;

    scenario.id = `ai-p-${crypto.randomUUID()}`;
    return scenario;
  }

  // ─── Quiz Question Generation ─────────────────────────────────────

  async generateQuizQuestion(
    difficulty:    Difficulty,
    attackType:    AttackType,
    usedScenarios: string[] = []
  ): Promise<QuizQuestion | null> {
    const optionLabels = ['a', 'b', 'c', 'd'];
    const correctLabel = optionLabels[Math.floor(Math.random() * 4)];

    const avoidList = usedScenarios.length
      ? `\nDo NOT repeat scenarios similar to: ${usedScenarios.join('; ')}.\nYour scenario must be on a completely different topic.`
      : '';

    const prompt = `You are generating a social engineering quiz question for a cybersecurity training application.

Difficulty: ${difficulty}
Attack type: ${attackType}
${avoidList}

The CORRECT answer MUST be option "${correctLabel}". This is mandatory — do not make any other option the correct answer.

Return ONLY a valid JSON object with EXACTLY this structure — no markdown, no explanation, no code fences:

{
  "id": "ai-q-001",
  "attackType": "${attackType}",
  "difficulty": "${difficulty}",
  "scenario": "A realistic 2-4 sentence scenario description. Be specific and creative — describe a real-world situation involving ${attackType}.",
  "options": [
    { "id": "a", "text": "${correctLabel === 'a' ? 'THE CORRECT RESPONSE - best security action to take' : `Plausible but incorrect option - a wrong response to the ${attackType} attack`}" },
    { "id": "b", "text": "${correctLabel === 'b' ? 'THE CORRECT RESPONSE - best security action to take' : `Plausible but incorrect option - a wrong response to the ${attackType} attack`}" },
    { "id": "c", "text": "${correctLabel === 'c' ? 'THE CORRECT RESPONSE - best security action to take' : `Plausible but incorrect option - a wrong response to the ${attackType} attack`}" },
    { "id": "d", "text": "${correctLabel === 'd' ? 'THE CORRECT RESPONSE - best security action to take' : `Plausible but incorrect option - a wrong response to the ${attackType} attack`}" }
  ],
  "correctId": "${correctLabel}",
  "explanation": "2-3 sentences explaining why option ${correctLabel} is correct and what makes the other options wrong or risky",
  "points": ${difficulty === 'rookie' ? 100 : difficulty === 'analyst' ? 150 : 200},
  "tip": "One concrete, actionable security tip related to defending against ${attackType} attacks"
}

Important rules:
- The scenario must be a specific, realistic situation — not generic
- Wrong options must be plausible enough to be tempting, not obviously wrong
- The correct answer (option ${correctLabel}) must be the best security response
- Explanation must reference why option ${correctLabel} specifically is correct
- Difficulty rookie = obvious attack with clear correct answer
- Difficulty analyst = moderately subtle, requires security knowledge
- Difficulty expert = very convincing scenario, correct answer requires careful reasoning`;

    const question = await this.callApi<QuizQuestion>(prompt, 1200);
    if (!question) return null;

    question.correctId = correctLabel; // safety net in case model drifts
    question.id        = `ai-q-${crypto.randomUUID()}`;
    return question;
  }

  // ─── Batch Generation ─────────────────────────────────────────────

  async generatePhishingBatch(difficulty: Difficulty, count: number): Promise<PhishingScenario[]> {
    const results:    PhishingScenario[] = [];
    const usedTitles: string[]           = [];

    for (let i = 0; i < count; i++) {
      const scenario = await this.generatePhishingScenario(difficulty, usedTitles);
      if (scenario) {
        results.push(scenario);
        usedTitles.push(scenario.title);
      }
    }
    return results;
  }

  async generateQuizBatch(difficulty: Difficulty, count: number): Promise<QuizQuestion[]> {
    const shuffledTypes = ([
      AttackType.Phishing,
      AttackType.Vishing,
      AttackType.Smishing,
      AttackType.Baiting,
      AttackType.Pretexting
    ]).sort(() => Math.random() - 0.5);

    const results:       QuizQuestion[] = [];
    const usedScenarios: string[]       = [];

    for (let i = 0; i < count; i++) {
      const attackType = shuffledTypes[i % shuffledTypes.length];
      const question   = await this.generateQuizQuestion(difficulty, attackType, usedScenarios);
      if (question) {
        results.push(question);
        usedScenarios.push(question.scenario.slice(0, 80));
      }
    }
    return results;
  }
}