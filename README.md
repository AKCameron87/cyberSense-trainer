# 🛡️ CyberSense Trainer

A full-stack cybersecurity awareness training application built with Angular. Train your instincts against real-world phishing attacks, social engineering tactics, and more — with both hand-crafted and AI-generated scenarios.

🔗 **Live Demo:** [https://AKCameron87.github.io/cyberSense-trainer/](https://AKCameron87.github.io/cyberSense-trainer/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Game Modes](#game-modes)
- [Difficulty Levels](#difficulty-levels)
- [AI Mode](#ai-mode)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Running the Proxy Server](#running-the-proxy-server)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## Overview

CyberSense Trainer is an interactive security awareness training platform designed to help users recognise and respond to common cyber threats. It simulates real-world attack scenarios including phishing emails, fake websites, vishing calls, smishing texts, baiting, and pretexting — across three difficulty tiers.

Users earn points, unlock badges, track their progress over time, and can export a PDF training report. An AI mode powered by the Claude API generates fresh, unique scenarios every session so no two playthroughs are ever the same.

---

## Features

- 🎣 **Phishing Simulator** — Click on red flags inside realistic phishing emails and fake websites
- 🧠 **Social Engineering Quiz** — Multiple choice scenarios covering 5 attack types
- 🏆 **Badge System** — Earn badges for performance and milestones
- 📊 **Dashboard** — Track total points, accuracy, sessions, and category breakdown
- 📄 **PDF Export** — Download a full training report after each session
- 🤖 **AI Generated Scenarios** — Infinitely unique content powered by Claude AI
- 🎨 **Page Transitions** — Smooth animations between routes
- 💾 **Progress Persistence** — Progress saved locally via localStorage

---

## Game Modes

### 🎣 Phishing Simulator
Realistic phishing emails and fake websites are shown one at a time. Click on anything suspicious to flag it as a red flag. Each scenario contains multiple hidden red flags worth varying points. You can skip scenarios or move on once all flags are found.

**What to look for:**
- Suspicious sender email domains
- Urgency or threatening language
- Fake or misleading links
- Incorrect branding or copyright
- Requests for sensitive information

### 🧠 Social Engineering Quiz
Multiple choice questions present realistic attack scenarios. Choose the best response and receive instant feedback with an explanation and a practical security tip. Covers 5 attack types across all difficulty levels.

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

| Level | Timer | Point Multiplier | Description |
|-------|-------|-----------------|-------------|
| 🟢 Rookie | None | 1x | Obvious red flags, ideal for beginners |
| 🟡 Analyst | 30s | 1.5x | Moderately subtle attacks, time pressure added |
| 🔴 Expert | 15s | 2x | Highly convincing scenarios, maximum challenge |

---

## AI Mode

Toggle **AI Generated Scenarios** on the home screen to enable dynamically generated content powered by the Claude API. Every session produces brand new, unique phishing emails and quiz questions tailored to your selected difficulty level.

> ⚠️ AI mode requires the local proxy server to be running (see below). On the live GitHub Pages site, AI mode gracefully falls back to the hand-crafted static scenarios.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 17+ (Standalone Components) |
| Styling | Tailwind CSS |
| Language | TypeScript |
| AI Integration | Anthropic Claude API (claude-sonnet-4) |
| Storage | localStorage (browser) |
| Deployment | GitHub Pages via angular-cli-ghpages |
| Proxy Server | Node.js (http/https) |

---

## Getting Started

### Prerequisites

- Node.js v18+
- Angular CLI (`npm install -g @angular/cli`)
- An Anthropic API key (for AI mode only — [console.anthropic.com](https://console.anthropic.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/AKCameron87/cyberSense-trainer.git
cd cyberSense-trainer

# Install dependencies
npm install

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
│   │   ├── models/           # TypeScript interfaces and enums
│   │   └── services/
│   │       ├── scenario.service.ts      # Loads static JSON scenarios
│   │       ├── progress.service.ts      # Tracks user progress & badges
│   │       └── ai-scenario.service.ts   # Generates AI scenarios via Claude API
│   └── features/
│       ├── home/             # Landing page with difficulty & mode selection
│       ├── phishing-sim/     # Phishing simulation game mode
│       ├── social-eng-quiz/  # Social engineering quiz game mode
│       ├── results/          # Post-session results & PDF export
│       └── dashboard/        # Progress tracking dashboard
├── assets/
│   └── data/
│       ├── phishing-scenarios.json   # 11 hand-crafted phishing scenarios
│       └── quiz-scenarios.json       # 28 hand-crafted quiz questions
└── styles.css                # Global styles & Tailwind config
```

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

- [ ] Firebase Authentication (user accounts)
- [ ] Firestore cloud progress sync
- [ ] Global leaderboard
- [ ] More scenario categories (QR code attacks, deepfake audio)
- [ ] Admin panel for custom scenario creation
- [ ] Team/organization training mode

---

## ⚠️ Disclaimer

CyberSense Trainer is built for **educational purposes only**. All phishing emails and attack scenarios are simulated and fictional. No real credentials are collected or transmitted.

---

*Built for security awareness education · CyberSense Trainer*