import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Firebase Imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from './environments/environment';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // Agregar Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    // Agregar soporte para Remote Config
    provideRemoteConfig(() => getRemoteConfig()),
  ],
}).catch(err => console.error(err));


