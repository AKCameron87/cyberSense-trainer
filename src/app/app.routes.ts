import { Routes } from '@angular/router';
import { PhishingSimComponent } from './features/phishing-sim/phishing-sim';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home').then(m => m.HomeComponent)
  },
{
  path: 'phishing-sim',
  loadComponent: () =>
    import('./features/phishing-sim/phishing-sim').then(m => {
      console.log('Module loaded, component:', m.PhishingSimComponent);
      return m.PhishingSimComponent;
    }).catch(err => {
      console.error('ROUTE LOAD ERROR:', err);
      throw err;
    })
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
    path: '**',
    redirectTo: ''
  }
];