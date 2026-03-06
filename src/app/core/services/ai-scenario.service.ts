import { Injectable } from '@angular/core';
import { PhishingScenario, QuizQuestion, Difficulty, AttackType } from '../models/index';

@Injectable({ providedIn: 'root' })
export class AiScenarioService {

  private readonly API_URL: string | null = window.location.hostname === 'localhost'
  ? 'http://localhost:3001/v1/messages'
  : null;
  private readonly MODEL   = 'claude-sonnet-4-20250514';


  async generatePhishingScenario(
    difficulty: Difficulty,
    usedTitles: string[] = []
  ): Promise<PhishingScenario | null> {
    const avoidList = usedTitles.length
      ? `Do NOT generate any of these scenarios: ${usedTitles.join(', ')}.`
      : '';

    const prompt = `Generate a realistic phishing simulation scenario for a cybersecurity training app.
Difficulty: ${difficulty}
${avoidList}

Return ONLY a valid JSON object with this exact structure:
{
  "id": "ai-p-001",
  "type": "email",
  "difficulty": "${difficulty}",
  "title": "Short descriptive title",
  "description": "One sentence instruction for the trainee",
  "category": "Attack category name",
  "subject": "Email subject line",
  "senderEmail": "fake@suspicious-domain.com",
  "totalPoints": 400,
  "redFlags": [
    {
      "id": "rf1",
      "elementId": "rf-sender",
      "description": "Why this is suspicious",
      "points": 100
    },
    {
      "id": "rf2",
      "elementId": "rf-urgency",
      "description": "Why this is suspicious",
      "points": 100
    },
    {
      "id": "rf3",
      "elementId": "rf-link",
      "description": "Why this is suspicious",
      "points": 100
    },
    {
      "id": "rf4",
      "elementId": "rf-footer",
      "description": "Why this is suspicious",
      "points": 100
    }
  ],
  "bodyHtml": "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'><!-- realistic email HTML here. IMPORTANT: each red flag elementId must appear as an id on a clickable HTML element inside this HTML --></div>"
}

Rules:
- difficulty rookie = obvious red flags, analyst = subtle, expert = very convincing
- The bodyHtml must be realistic looking HTML email content
- Every elementId in redFlags (rf-sender, rf-urgency, rf-link, rf-footer) MUST appear as an id attribute on a element in bodyHtml
- Make the email look convincing but with detectable flaws appropriate to the difficulty
- totalPoints = sum of all red flag points
- Return ONLY the JSON, no markdown, no explanation`;

    try {
     const response = await fetch(this.API_URL!, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
        model:      this.MODEL,
        max_tokens: 2000,
        messages:   [{ role: 'user', content: prompt }]
        })
     });

      const data = await response.json();
      const text = data.content?.[0]?.text ?? '';
      const clean = text.replace(/```json|```/g, '').trim();
      const scenario = JSON.parse(clean) as PhishingScenario;
      scenario.id = `ai-p-${Date.now()}`;
      return scenario;
    } catch (err) {
      console.error('AI scenario generation failed:', err);
      return null;
    }
  }

  async generateQuizQuestion(
    difficulty: Difficulty,
    attackType: AttackType,
    usedIds: string[] = []
  ): Promise<QuizQuestion | null> {
    const prompt = `Generate a realistic social engineering quiz question for a cybersecurity training app.
Difficulty: ${difficulty}
Attack type: ${attackType}

Return ONLY a valid JSON object with this exact structure:
{
  "id": "ai-q-001",
  "attackType": "${attackType}",
  "difficulty": "${difficulty}",
  "scenario": "A realistic 2-4 sentence scenario description",
  "options": [
    { "id": "a", "text": "First answer option" },
    { "id": "b", "text": "Second answer option" },
    { "id": "c", "text": "Correct answer option" },
    { "id": "d", "text": "Fourth answer option" }
  ],
  "correctId": "c",
  "explanation": "2-3 sentence explanation of why this is the correct answer",
  "points": 150,
  "tip": "One practical security tip related to this scenario"
}

Rules:
- difficulty rookie = obvious attack, analyst = moderately subtle, expert = very convincing
- The scenario must be realistic and plausible
- One option must be clearly correct, others plausible but wrong
- The correct answer should NOT always be option c — randomize which option id is correct
- explanation should teach the user something valuable
- points: rookie=100, analyst=150, expert=200
- Return ONLY the JSON, no markdown, no explanation`;

    try {
      const response = await fetch(this.API_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model:      this.MODEL,
          max_tokens: 1000,
          messages:   [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();
      const text = data.content?.[0]?.text ?? '';
      const clean = text.replace(/```json|```/g, '').trim();
      const question = JSON.parse(clean) as QuizQuestion;
      question.id = `ai-q-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      return question;
    } catch (err) {
      console.error('AI question generation failed:', err);
      return null;
    }
  }

  async generatePhishingBatch(
    difficulty: Difficulty,
    count: number
  ): Promise<PhishingScenario[]> {
    const results: PhishingScenario[] = [];
    const usedTitles: string[] = [];

    for (let i = 0; i < count; i++) {
      const scenario = await this.generatePhishingScenario(difficulty, usedTitles);
      if (scenario) {
        results.push(scenario);
        usedTitles.push(scenario.title);
      }
    }
    return results;
  }

  async generateQuizBatch(
    difficulty: Difficulty,
    count: number
  ): Promise<QuizQuestion[]> {
    const attackTypes: AttackType[] = [
        AttackType.Phishing,
        AttackType.Vishing,
        AttackType.Smishing,
        AttackType.Baiting,
        AttackType.Pretexting
        ];

    const results: QuizQuestion[] = [];
    const usedIds: string[] = [];

    for (let i = 0; i < count; i++) {
      const attackType = attackTypes[i % attackTypes.length];
      const question = await this.generateQuizQuestion(difficulty, attackType, usedIds);
      if (question) {
        results.push(question);
        usedIds.push(question.id);
      }
    }
    return results;
  }
}