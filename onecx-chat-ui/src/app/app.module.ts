import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LetModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { KeycloakAuthModule } from '@onecx/keycloak-auth';
import {
  AppStateService,
  APP_CONFIG,
  ConfigurationService,
  createTranslateLoader,
  PortalCoreModule,
  PortalMissingTranslationHandler,
  translateServiceInitializer,
  UserService,
} from '@onecx/portal-integration-angular';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { metaReducers, reducers } from './app.reducers';

import { Configuration } from './shared/generated';
import { apiConfigProvider } from './shared/utils/apiConfigProvider.utils';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';

 
export const commonImports = [CommonModule];

@NgModule({
  declarations: [AppComponent],
  imports: [
    ...commonImports,
    KeycloakAuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    InputTextareaModule,
    DropdownModule,
    DialogModule,
    AppRoutingModule,
    LetModule,
    StoreRouterConnectingModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    EffectsModule.forRoot([]),
    HttpClientModule,
    PortalCoreModule.forRoot('onecx-chat-ui-app'),
    TranslateModule.forRoot({
      extend: true,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, AppStateService],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: PortalMissingTranslationHandler,
      },
    }),
  ],
  providers: [
    DialogService,
    { provide: APP_CONFIG, useValue: environment },
    {
      provide: APP_INITIALIZER,
      useFactory: translateServiceInitializer,
      multi: true,
      deps: [UserService, TranslateService],
    },
    {
      provide: Configuration,
      useFactory: apiConfigProvider,
      deps: [ConfigurationService, AppStateService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
