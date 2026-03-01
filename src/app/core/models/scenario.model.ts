import { Difficulty } from './difficulty.model';

export enum ScenarioType {
    Email = 'email',
    FakeSite = 'fake-site'
}

export interface RedFlag {
    id: string;
    elementId: string; // maps to CSS id in the email/site template
    description: string; // explanation shown after the user clicks
    points: number;       
}

export interface PhishingScenario {
    id: string;
    type: ScenarioType;
    difficulty: Difficulty;
    title: string;
    description: string; // brief context shown before the simulation starts
    sender?: string; // for email scenarios
    senderEmail?: string // for email scenarios
    subject?: string; // for email scenarios
    siteUrl?: string; // for fake-site scenarios
    bodyHtml: string; // The rendered email or site HTML
    redFlags: RedFlag[];
    totalPoints: number;
    explanation: string; // Shown on the results screen
    category: string; // e.g. 'Credential Harvesting', 'Malware', etc.
}




