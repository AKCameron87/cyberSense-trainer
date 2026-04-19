import { ApplicationConfig }                     from '@angular/core';
import { provideRouter, withPreloading,
         PreloadAllModules, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch }           from '@angular/common/http';
import { provideFirebaseApp, initializeApp }      from '@angular/fire/app';
import { provideAuth, getAuth }                   from '@angular/fire/auth';
import { provideFirestore, getFirestore }         from '@angular/fire/firestore';
import { routes }                                 from './app.routes';
import { firebaseConfig }                         from './core/firebase.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withViewTransitions()
    ),
    provideHttpClient(withFetch()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
};