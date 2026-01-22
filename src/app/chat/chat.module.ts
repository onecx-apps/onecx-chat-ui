import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { PortalCoreModule, providePortalDialogService } from '@onecx/portal-integration-angular';
import { ChatDetailsComponent } from './pages/chat-details/chat-details.component';
import { ChatDetailsEffects } from './pages/chat-details/chat-details.effects';

import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  addInitializeModuleGuard,
} from '@onecx/angular-integration-interface';
import { CalendarModule } from 'primeng/calendar';
import { SidebarModule } from 'primeng/sidebar';
import { SharedModule } from '../shared/shared.module';
import { chatFeature } from './chat.reducers';
import { routes } from './chat.routes';
import { ChatAssistantComponent } from './pages/chat-assistant/chat-assistant.component';
import { ChatAssistantEffects } from './pages/chat-assistant/chat-assistant.effects';
import { ChatSearchComponent } from './pages/chat-search/chat-search.component';
import { ChatSearchEffects } from './pages/chat-search/chat-search.effects';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';

@NgModule({

  providers: [providePortalDialogService()],
  declarations: [ChatDetailsComponent, ChatDetailsComponent, ChatSearchComponent],
  imports: [
    CommonModule,
    SharedModule,
    LetDirective,
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forChild(addInitializeModuleGuard(routes)),
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    StoreModule.forFeature(chatFeature),
    EffectsModule.forFeature([ChatDetailsEffects, ChatDetailsEffects, ChatSearchEffects, ChatAssistantEffects]),
    TranslateModule,
    SidebarModule,
    AvatarModule,
    ChatAssistantComponent,
  ],
})
export class ChatModule { }