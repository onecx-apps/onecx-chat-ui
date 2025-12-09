import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { NavigatorActions } from './navigator.actions';
import { selectNavigatorCurrentPage } from './navigator.selectors';
import { ChatAssistantActions } from '../chat-assistant.actions';
import {
  selectSelectedChatMode,
  selectChats,
  selectChatAssistantViewModel,
} from '../chat-assistant.selectors';
import { ChatInitialScreenComponent } from '../../../shared/components/chat-initial-screen/chat-initial-screen.component';
import { ChatSettingsComponent, ChatSettingsFormValue } from '../../../shared/components/chat-settings/chat-settings.component';
import { ChatListComponent } from '../../../../shared/components/chat-list/chat-list.component';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
import { ChatHeaderComponent } from '../../../shared/components/chat-header/chat-header.component';
import { Chat } from '../../../../shared/generated';
import { MenuItem } from 'primeng/api';

/**
 * SMART COMPONENT: Navigator
 * 
 * Manages navigation between different pages (Initial Screen, New Chat Form, Chat List, Chat View).
 * Listens to NGRX state for currentPage and dispatches navigation actions.
 */
@Component({
  selector: 'app-navigator',
  standalone: true,
  imports: [
    CommonModule,
    ChatInitialScreenComponent,
    ChatSettingsComponent,
    ChatListComponent,
    ChatComponent,
    ChatHeaderComponent,
  ],
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent {
  currentPage$: Observable<'chatList' | 'chat' | 'newChat' | null>;

  selectedChatMode$: Observable<string | null>;

  chats$: Observable<Chat[]>;

  chatMessages$: Observable<any[]>;

  viewModel$: Observable<any>;

  menuItems: MenuItem[] = [];

  constructor(private store: Store) {
    this.currentPage$ = this.store.select(selectNavigatorCurrentPage);
    this.selectedChatMode$ = this.store.select(selectSelectedChatMode);
    this.chats$ = this.store.select(selectChats);
    this.viewModel$ = this.store.select(selectChatAssistantViewModel);
    
    this.chatMessages$ = this.viewModel$.pipe(
      map(vm => vm?.currentMessages || [])
    );
  }

  onChatModeSelected(mode: string) {
    this.store.dispatch(NavigatorActions.chatModeSelected({ mode }));
    this.store.dispatch(ChatAssistantActions.chatModeSelected({ mode }));
  }

  onBackFromNewChat() {
    this.store.dispatch(NavigatorActions.backFromNewChat());
  }

  onBackFromChatList() {
    this.store.dispatch(NavigatorActions.backFromChatList());
  }

  onBackFromChat() {
    this.store.dispatch(NavigatorActions.backFromChat());
  }

  onChatSelected(chat: Chat) {
    if (chat.id === 'new') {
      this.store.dispatch(NavigatorActions.newChatButtonClicked());
    } else if (chat.id) {
      this.store.dispatch(ChatAssistantActions.chatChosen({ chatId: chat.id }));
    }
  }

  onMessageSent(message: string) {
    this.store.dispatch(ChatAssistantActions.messageSent({ message }));
  }
}
