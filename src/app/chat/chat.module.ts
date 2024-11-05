import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { SharedModule } from '../shared/shared.module';
import { chatFeature } from './chat.reducers';
import { routes } from './chat.routes';
import { ChatSearchComponent } from './pages/chat-search/chat-search.component';
import { ChatSearchEffects } from './pages/chat-search/chat-search.effects';
import { FullChatComponent } from './pages/full-chat/full-chat.component';

@NgModule({
  declarations: [ChatSearchComponent, FullChatComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    EffectsModule.forFeature([ChatSearchEffects]),
    TranslateModule,
  ],
})
export class ChatModule {}
