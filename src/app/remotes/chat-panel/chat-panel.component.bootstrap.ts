import { Location } from '@angular/common';
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  importProvidersFrom,
  Injectable,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AngularAuthModule } from '@onecx/angular-auth';
import { bootstrapRemoteComponent } from '@onecx/angular-webcomponents';
import {
  createRemoteComponentTranslateLoader,
  providePortalDialogService,
  UserService,
} from '@onecx/portal-integration-angular';
import { chatAssistantFeature } from 'src/app/chat/chat.reducers';
import { ChatAssistantEffects } from 'src/app/chat/pages/chat-assistant/chat-assistant.effects';
import { ChatsInternal, Configuration } from 'src/app/shared/generated';
import { environment } from 'src/environments/environment';
import { OneCXChatPanelComponent } from './chat-panel.component';
import {
  BASE_URL,
  provideTranslateServiceForRoot,
} from '@onecx/angular-remote-components';
import { TranslateLoader } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';

function userProfileInitializer(userService: UserService) {
  return async () => {
    await userService.isInitialized;
  };
}

@Injectable({ providedIn: 'root' })
export class ChatInternalService {
  constructor(private chatInternalService: ChatsInternal) {}

  overwriteBaseURL(baseUrl: string) {
    this.chatInternalService.configuration = new Configuration({
      basePath: Location.joinWithSlash(baseUrl, environment.apiPrefix),
    });
  }

  getService() {
    return this.chatInternalService;
  }
}

bootstrapRemoteComponent(
  OneCXChatPanelComponent,
  'ocx-chat-panel-component',
  environment.production,
  [
    provideHttpClient(withInterceptorsFromDi()),
    providePortalDialogService(),
    {
      provide: BASE_URL,
      useValue: new ReplaySubject<string>(1),
    },
    provideTranslateServiceForRoot({
      isolate: true,
      loader: {
        provide: TranslateLoader,
        useFactory: createRemoteComponentTranslateLoader,
        deps: [HttpClient, BASE_URL],
      },
    }),
    importProvidersFrom(
      AngularAuthModule,
      BrowserModule,
      BrowserAnimationsModule,
      StoreRouterConnectingModule.forRoot(),
      StoreModule.forRoot({}),
      StoreModule.forFeature(chatAssistantFeature),
      StoreDevtoolsModule.instrument(),
      EffectsModule.forRoot([]),
      EffectsModule.forFeature([ChatAssistantEffects])
    ),
    provideRouter([
      {
        path: '**',
        children: [],
      },
    ]),
    {
      provide: APP_INITIALIZER,
      useFactory: userProfileInitializer,
      deps: [UserService],
      multi: true,
    },
    ChatInternalService,
  ]
);
