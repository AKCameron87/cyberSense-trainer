# 🛡️ CyberSense Trainer

A full-stack cybersecurity awareness training application built with Angular and Firebase. Train your instincts against real-world phishing attacks, social engineering tactics, and more — with both hand-crafted and AI-generated scenarios.

🔗 **Live Demo:** [https://AKCameron87.github.io/cyberSense-trainer/](https://AKCameron87.github.io/cyberSense-trainer/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Game Modes](#game-modes)
- [Difficulty Levels](#difficulty-levels)
- [AI Mode](#ai-mode)
- [Authentication](#authentication)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Firebase Setup](#firebase-setup)
- [Running the Proxy Server](#running-the-proxy-server)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## Overview

CyberSense Trainer is an interactive security awareness training platform designed to help users recognise and respond to common cyber threats. It simulates real-world attack scenarios including phishing emails, fake websites, vishing calls, smishing texts, baiting, and pretexting — across three difficulty tiers.

Users can create an account to sync their progress across devices, compete on the global leaderboard, earn badges, and export a full PDF training report. An AI mode powered by the Claude API generates fresh, unique scenarios every session so no two playthroughs are ever the same.

---

## Features

- 🎣 **Phishing Simulator** — Click on red flags inside realistic phishing emails and fake websites
- ❌ **Wrong Click Penalties** — Incorrect clicks deduct points scaled to difficulty, adding real consequence
- 🧠 **Social Engineering Quiz** — Multiple choice scenarios covering 5 attack types
- 🔀 **Shuffled Answers** — Quiz answer options are randomised each session to prevent pattern recognition
- 🏆 **Global Leaderboard** — Compete with other trainers worldwide
- 👤 **User Accounts** — Sign in with Google or email/password with enforced password policy
- ☁️ **Cloud Sync** — Progress saved to Firestore and synced across devices
- 🥇 **Badge System** — Earn badges for performance and milestones
- 📊 **Dashboard** — Track total points, accuracy, sessions, and category breakdown
- 📈 **Score Breakdown** — Results show base points and difficulty bonus separately
- 📄 **PDF Export** — Download a full training report after each session
- 🤖 **AI Generated Scenarios** — Infinitely unique content powered by Claude AI
- 🎨 **Page Transitions** — Smooth animations between routes

---

## Game Modes

### 🎣 Phishing Simulator
Realistic phishing emails and fake websites are shown one at a time. Click on anything suspicious to flag it as a red flag. Each scenario contains multiple hidden red flags worth varying points.

**Scoring:**
- Each red flag found earns points multiplied by your difficulty modifier
- Wrong clicks on non-suspicious elements deduct points — penalties scale with difficulty
- Rookie: -15 pts | Analyst: -25 pts | Expert: -40 pts per wrong click

**What to look for:**
- Suspicious sender email domains
- Urgency or threatening language
- Fake or misleading links
- Incorrect branding or copyright
- Requests for sensitive information

### 🧠 Social Engineering Quiz
Multiple choice questions present realistic attack scenarios. Answer options are shuffled every session so you can't rely on position memory. Choose the best response and receive instant feedback with an explanation and a practical security tip.

**Attack types covered:**
| Type | Description |
|------|-------------|
| Phishing | Email-based deception attacks |
| Vishing | Voice/phone-based social engineering |
| Smishing | SMS/text message attacks |
| Baiting | Using curiosity or greed as a lure |
| Pretexting | Fabricated scenarios to extract information |

---

## Difficulty Levels

| Level | Timer | Point Multiplier | Wrong Click Penalty | Description |
|-------|-------|-----------------|-------------------|-------------|
| 🟢 Rookie | None | 1x | -15 pts | Obvious red flags, ideal for beginners |
| 🟡 Analyst | 30s | 1.5x | -25 pts | Moderately subtle attacks, time pressure added |
| 🔴 Expert | 15s | 2x | -40 pts | Highly convincing scenarios, maximum challenge |

---

## Score Breakdown

The results page displays your score transparently:

- **Base points** — raw points earned before any multiplier
- **Difficulty bonus** — extra points from the difficulty multiplier
- **Total points** — final score added to your leaderboard ranking
- **Accuracy percentage** — calculated from base score vs total possible, never exceeds 100%

---

## AI Mode

Toggle **AI Generated Scenarios** on the home screen to enable dynamically generated content powered by the Claude API. Every session produces brand new, unique phishing emails and quiz questions tailored to your selected difficulty level.

> ⚠️ AI mode requires the local proxy server to be running (see below). On the live GitHub Pages site, AI mode gracefully falls back to the hand-crafted static scenarios.

---

## Authentication

CyberSense Trainer supports user accounts via Firebase Authentication.

**Sign in options:**
- Google (one-click)
- Email and password

**Password policy (email/password accounts):**
- Minimum 16 characters
- Must include uppercase and lowercase letters
- Must include at least one number
- Must include at least one special character

A live strength meter and requirements checklist guide users through the policy during registration. The register button is disabled until all requirements are met.

**What an account unlocks:**
- Cloud sync — progress saved to Firestore and available on any device
- Global leaderboard — scores submitted after each session
- Persistent rank tracking across sessions

Signing in is optional. The app is fully playable without an account using local browser storage.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 21 (Standalone Components) |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| AI Integration | Anthropic Claude API (claude-sonnet-4) |
| Storage | Firestore (cloud) + localStorage (fallback) |
| Deployment | GitHub Pages via angular-cli-ghpages |
| Proxy Server | Node.js (http/https) |

---

## Getting Started

### Prerequisites

- Node.js v18+
- Angular CLI (`npm install -g @angular/cli`)
- A Firebase project (for auth and leaderboard)
- An Anthropic API key (for AI mode only — [console.anthropic.com](https://console.anthropic.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/AKCameron87/cyberSense-trainer.git
cd cyberSense-trainer

# Install dependencies
npm install --legacy-peer-deps

# Start the development server
ng serve
```

Open your browser at `http://localhost:4200`

---

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── firebase.config.ts           # Firebase configuration
│   │   ├── models/                      # TypeScript interfaces and enums
│   │   └── services/
│   │       ├── scenario.service.ts      # Loads static JSON scenarios
│   │       ├── progress.service.ts      # Tracks user progress & badges
│   │       ├── ai-scenario.service.ts   # Generates AI scenarios via Claude API
│   │       ├── auth.service.ts          # Firebase Authentication
│   │       └── firestore.service.ts     # Firestore read/write operations
│   └── features/
│       ├── home/             # Landing page with difficulty & mode selection
│       ├── auth/             # Login & registration with password strength meter
│       ├── phishing-sim/     # Phishing simulation with wrong click penalties
│       ├── social-eng-quiz/  # Social engineering quiz with shuffled answers
│       ├── results/          # Results with base/bonus score breakdown
│       ├── dashboard/        # Progress tracking and badge collection
│       └── leaderboard/      # Global rankings
├── assets/
│   └── data/
│       ├── phishing-scenarios.json   # 11 hand-crafted phishing scenarios
│       └── quiz-scenarios.json       # 28 hand-crafted quiz questions
└── styles.css                        # Global styles & Tailwind config
```

---

## Firebase Setup

To run this project locally with Firebase features enabled:

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a project
2. Enable **Authentication** → **Google** and **Email/Password** providers
3. Enable **Firestore Database** — choose your region (recommend `us-east1`)
4. Register a web app and copy the `firebaseConfig`
5. Create `src/app/core/firebase.config.ts`:

```ts
export const firebaseConfig = {
  apiKey:            'YOUR_API_KEY',
  authDomain:        'YOUR_PROJECT.firebaseapp.com',
  projectId:         'YOUR_PROJECT_ID',
  storageBucket:     'YOUR_PROJECT.firebasestorage.app',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId:             'YOUR_APP_ID'
};
```

> 🔒 Never commit `firebase.config.ts` with real credentials to a public repository. Add it to `.gitignore`.

### Firestore Security Rules

In the Firebase console go to **Firestore** → **Rules** and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/progress/data {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /leaderboard/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Password Policy

In Firebase console go to **Authentication** → **Settings** → **Password policy** and configure:
- Minimum length: 16
- Require uppercase, lowercase, numeric, and special characters

### Authorized Domains

For Google sign-in to work on the deployed site:

**Authentication** → **Settings** → **Authorized domains** → Add `akcameron87.github.io`

---

## Running the Proxy Server

AI mode requires a local proxy server to forward requests to the Anthropic API (required to bypass browser CORS restrictions).

### Start the proxy

**macOS/Linux:**
```bash
ANTHROPIC_API_KEY=your_api_key_here node proxy-server.js
```

**Windows PowerShell:**
```powershell
$env:ANTHROPIC_API_KEY="your_api_key_here"; node proxy-server.js
```

You should see:
```
Proxy server running at http://localhost:3001
```

### Then start Angular in a second terminal

```bash
ng serve
```

> 🔒 Never commit your API key to Git. The `proxy-server.js` file is listed in `.gitignore`.

---

## Deployment

Build for production and deploy to GitHub Pages:

```bash
# Build
ng build --configuration production --base-href "https://AKCameron87.github.io/cyberSense-trainer/"

# Deploy
npx angular-cli-ghpages --dir=dist/cyberSense-trainer/browser
```

---

## Roadmap

- [x] Firebase Authentication (user accounts)
- [x] Firestore cloud progress sync
- [x] Global leaderboard
- [x] Wrong click penalties in phishing simulator
- [x] Shuffled quiz answers
- [x] Password policy with strength meter
- [x] Base/bonus score breakdown on results
- [ ] More scenario categories (QR code attacks, deepfake audio)
- [ ] Admin panel for custom scenario creation
- [ ] Team/organization training mode

---

## ⚠️ Disclaimer

CyberSense Trainer is built for **educational purposes only**. All phishing emails and attack scenarios are simulated and fictional. No real credentials are collected or transmitted.

---

*Built for security awareness education · CyberSense Trainer*