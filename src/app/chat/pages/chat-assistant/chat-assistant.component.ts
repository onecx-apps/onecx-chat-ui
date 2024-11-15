import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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

  constructor(private readonly store: Store) {}

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
