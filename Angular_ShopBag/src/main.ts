import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './app/services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
// bootstrapApplication(AppComponent, appConfig).catch((err) =>
//   console.error(err)
// );

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule),
  ],
}).catch((err) => console.error(err));
