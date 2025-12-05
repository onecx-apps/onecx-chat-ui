import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem, SharedModule } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { combineLatest, firstValueFrom, map, Observable } from 'rxjs';
import { ChatListComponent } from 'src/app/shared/components/chat-list/chat-list.component';
import { ChatComponent } from 'src/app/shared/components/chat/chat.component';
import { Chat } from 'src/app/shared/generated';
import { ChatAssistantActions } from './chat-assistant.actions';
import { selectChatAssistantViewModel } from './chat-assistant.selectors';
import { ChatAssistantViewModel } from './chat-assistant.viewmodel';
import { environment } from 'src/environments/environment';
import { ChatSliderComponent } from '../../shared/components/chat-silder/chat-slider.component';
import { ChatHeaderComponent } from '../../shared/components/chat-header/chat-header.component';
import { ChatInitialScreenComponent } from '../../shared/components/chat-initial-screen/chat-initial-screen.component';
import { NewDirectChatComponent } from '../new-direct-chat/new-direct-chat.component';

@Component({
  selector: 'app-chat-assistant',
  templateUrl: './chat-assistant.component.html',
  styleUrls: ['./chat-assistant.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LetDirective,
    CalendarModule,
    SidebarModule,
    TranslateModule,
    SharedModule,
    ChatComponent,
    ChatListComponent,
    TooltipModule,
    ChatSliderComponent,
    ChatHeaderComponent,
    ChatInitialScreenComponent,
    NewDirectChatComponent,
  ],
})
export class ChatAssistantComponent {
  environment = environment;
  viewModel$: Observable<ChatAssistantViewModel>;
  menuItems: Observable<MenuItem[]>;

  constructor(
    private readonly store: Store,
    private translateService: TranslateService,
  ) {
    this.viewModel$ = this.store.select(selectChatAssistantViewModel);

    this.menuItems = combineLatest([
      this.viewModel$,
      this.translateService.get(['CHAT.ACTIONS.DELETE']),
    ]).pipe(
      map(([viewModel, translations]) => {
        return [
          {
            label: translations['CHAT.ACTIONS.DELETE'],
            icon: 'pi pi-trash',
            disabled: viewModel.currentChat?.id === 'new',
            command: () => {
              this.store.dispatch(ChatAssistantActions.currentChatDeleted());
            },
          },
        ] as MenuItem[];
      }),
    );
  }

  sendMessage(message: string) {
    this.store.dispatch(
      ChatAssistantActions.messageSent({
        message,
      }),
    );
  }

  chatSelected(chat: Chat) {
    this.store.dispatch(
      ChatAssistantActions.chatSelected({
        chat,
      }),
    );
  }

  openSidebar() {
    this.store.dispatch(ChatAssistantActions.chatPanelOpened());
  }

  closeSidebar() {
    this.store.dispatch(ChatAssistantActions.chatPanelClosed());
    this.store.dispatch(ChatAssistantActions.chatModeDeselected());
  }

  // NEW METHODS ONECX COMPANION
  selectChatMode(mode: string) {
    if (mode === 'close') {
      this.store.dispatch(ChatAssistantActions.chatPanelClosed());
      this.store.dispatch(ChatAssistantActions.chatModeDeselected());
      return;
    }
    this.store.dispatch(ChatAssistantActions.chatModeSelected({ mode }));
  }

  goBack() {
    this.store.dispatch(ChatAssistantActions.chatModeDeselected());
  }

  @HostListener('document:click', ['$event'])
  async onDocumentClick(event: MouseEvent) {
    const viewModel = await firstValueFrom(this.viewModel$);
    if (!viewModel.sidebarVisible) {
      return;
    }

    const clickedElement = event.target as HTMLElement;

    // Check if clicked INSIDE sidebar - if so, do nothing
    const isInsideSidebar = clickedElement.closest('.p-sidebar') ||
                           clickedElement.closest('[role="complementary"]') ||
                           clickedElement.closest('app-chat-slider') ||
                           clickedElement.closest('app-chat-initial-screen') ||
                           clickedElement.closest('app-chat-option-button') ||
                           clickedElement.closest('app-chat-header') ||
                           clickedElement.closest('.pi-trash');

    if (isInsideSidebar) {
      return;
    }

    // Check if clicked on chat TOGGLE button - if so, let the toggle manage the state
    const isChatToggleButton = clickedElement.closest('[aria-label*="Chat"]') || 
                               clickedElement.closest('.chat-toggle-button') ||
                               clickedElement.closest('.chat-button') ||
                               clickedElement.id === 'chat-toggle-button';

    if (!isChatToggleButton) {
      this.closeSidebar();
    }
  }
}