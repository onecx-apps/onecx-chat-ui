import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { combineLatest, map, Observable } from 'rxjs';
import { ChatMessage } from 'src/app/shared/components/chat/chat.viewmodel';
import { Chat } from 'src/app/shared/generated';
import { ChatAssistantActions } from './chat-assistant.actions';
import { selectChatAssistantViewModel } from './chat-assistant.selectors';
import { ChatAssistantViewModel } from './chat-assistant.viewmodel';

@Component({
  selector: 'app-chat-assistant',
  templateUrl: './chat-assistant.component.html',
  styleUrl: './chat-assistant.component.css',
})
export class ChatAssistantComponent {
  viewModel$: Observable<ChatAssistantViewModel> = this.store.select(
    selectChatAssistantViewModel
  );

  chatMessages: ChatMessage[] = [];

  chatsLoading = false;

  constructor(
    private readonly store: Store,
    private translateService: TranslateService
  ) {}

  menuItems: Observable<MenuItem[]> = combineLatest([
    this.viewModel$,
    this.translateService.get(['CHAT.ACTIONS.DELETE']),
  ]).pipe(
    map(([vm, t]) => {
      return [
        {
          label: t['CHAT.ACTIONS.DELETE'],
          icon: 'pi pi-trash',
          disabled: vm.currentChat?.id === 'new',
          command: () => {
            this.store.dispatch(ChatAssistantActions.currentChatDeleted());
          },
        },
      ] as MenuItem[];
    })
  );

  sendMessage(message: string) {
    this.store.dispatch(
      ChatAssistantActions.messageSent({
        message,
      })
    );
  }

  chatSelected(chat: Chat) {
    this.store.dispatch(
      ChatAssistantActions.chatSelected({
        chat,
      })
    );
  }
}
