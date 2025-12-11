import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  addInitializeModuleGuard,
  PortalCoreModule,
} from '@onecx/portal-integration-angular';
import { CalendarModule } from 'primeng/calendar';
import { SidebarModule } from 'primeng/sidebar';
import { SharedModule } from '../shared/shared.module';
import { chatAssistantFeature, chatSearchFeature } from './chat.reducers';
import { routes } from './chat.routes';
import { ChatAssistantComponent } from './pages/chat-assistant/chat-assistant.component';
import { ChatAssistantEffects } from './pages/chat-assistant/chat-assistant.effects';
import { ChatSearchComponent } from './pages/chat-search/chat-search.component';
import { ChatSearchEffects } from './pages/chat-search/chat-search.effects';

@NgModule({
  declarations: [ChatSearchComponent],
  imports: [
    CommonModule,
    SharedModule,
    LetDirective,
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forChild(addInitializeModuleGuard(routes)),
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    StoreModule.forFeature(chatAssistantFeature),
    StoreModule.forFeature(chatSearchFeature),
    EffectsModule.forFeature([ChatSearchEffects, ChatAssistantEffects]),
    TranslateModule,
    SidebarModule,
    ChatAssistantComponent,
  ],
})
export class ChatModule {}
