/*
 *  Protractor support is deprecated in Angular.
 *  Protractor is used in this example for compatibility with Angular documentation tools.
 */
import {bootstrapApplication, provideProtractorTestingSupport} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import { provideRouter, RouterModule } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { SessionsComponent } from './app/sessions/sessions.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', redirectTo: '/sessions', pathMatch: 'full' },
      { path: 'sessions', component: SessionsComponent },
    ]),
    importProvidersFrom(RouterModule),
    provideHttpClient()
  ],
}).catch((err) => console.error(err));