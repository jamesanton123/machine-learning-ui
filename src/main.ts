/*
 *  Protractor support is deprecated in Angular.
 *  Protractor is used in this example for compatibility with Angular documentation tools.
 */
import {bootstrapApplication, provideProtractorTestingSupport} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import { provideRouter, RouterModule } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { ModelsComponent } from './app/models/models.component';
import { provideHttpClient } from '@angular/common/http';
import { ModelDetailsComponent } from './app/models/model-details/model-details.component';
import { ProviderDetailsComponent } from './app/models/model-details/provider-details/provider-details.component';
import { ProviderDataComponent } from './app/models/model-details/provider-data/provider-data.component';
import { ClassifyComponent } from './app/models/model-details/classify/classify.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', redirectTo: '/models', pathMatch: 'full' },
      { path: 'models', component: ModelsComponent },
      { path: 'models/:id', component: ModelDetailsComponent },
      { path: 'models/:id/provider-details/:providerId', component: ProviderDetailsComponent },
      { path: 'models/:id/provider-data', component: ProviderDataComponent },
      { path: 'models/:id/classify', component: ClassifyComponent }
    ]),
    importProvidersFrom(RouterModule),
    provideHttpClient()
  ],
}).catch((err) => console.error(err));