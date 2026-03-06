import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'phishing-sim',
    loadComponent: () =>
      import('./features/phishing-sim/phishing-sim').then(m => m.PhishingSimComponent)
  },
  {
    path: 'social-eng-quiz',
    loadComponent: () =>
      import('./features/social-eng-quiz/social-eng-quiz').then(m => m.SocialEngQuizComponent)
  },
  {
    path: 'results',
    loadComponent: () =>
      import('./features/results/results').then(m => m.ResultsComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'leaderboard',
    loadComponent: () =>
      import('./features/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];