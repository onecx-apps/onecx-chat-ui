import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chat, ChatType } from '../../generated';

export const NEW_HUMAN_CHAT_ITEM = {
  topic: 'CHAT.NEW_CHAT',
  id: 'new',
  type: ChatType.HumanChat,
};
export const NEW_AI_CHAT_ITEM = {
  topic: 'CHAT.NEW_CHAT',
  id: 'new',
  type: ChatType.AiChat,
};

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatListComponent {
  @Input()
  chats: Chat[] | undefined;

  @Input()
  selectedChat: Chat | undefined;

  @Input()
  loading = false;

  @Output()
  chatSelected = new EventEmitter<Chat>();

  onChange({ value }: { value: Chat }) {
    this.chatSelected.emit(value);
  }
}
