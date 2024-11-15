import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChatMessage } from 'src/app/shared/components/chat/chat.viewmodel';
import { Chat, MessageType } from 'src/app/shared/generated';
import { ChatAssistantViewModel } from './chat-assistant.viewmodel';
import { Observable } from 'rxjs';
import { selectChatAssistantViewModel } from './chat-assistant.selectors';
import { ChatAssistantActions } from './chat-assistant.actions';

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
    const newMessage: ChatMessage = {
      creationDate: new Date(),
      id: (this.chatMessages.length + 1).toString(),
      type: MessageType.Human,
      text: message,
      userName: 'User123',
    };
    this.chatMessages.push(newMessage);
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
