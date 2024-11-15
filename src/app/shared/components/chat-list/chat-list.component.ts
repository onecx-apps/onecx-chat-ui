import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Chat, ChatType } from '../../generated';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatListComponent implements OnChanges {
  @Input()
  chats: Chat[] | undefined;

  newChatItem = { topic: 'CHAT.NEW_CHAT', id: 'new', type: ChatType.HumanChat };

  selectedChat = this.newChatItem;

  @Input()
  loading = false;

  @Output()
  chatSelected = new EventEmitter<Chat>();

  ngOnChanges() {
    if (!this.chats?.includes(this.newChatItem)) {
      this.chats = [this.newChatItem, ...(this.chats ?? [])];
    }
  }

  onChange({ value }: { value: Chat }) {
    this.chatSelected.emit(value);
  }
}
