import { Component, Input, OnInit } from '@angular/core';
import { Chat, ChatType } from '../../generated';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatListComponent implements OnInit {
  @Input()
  chats: Chat[] | undefined;

  newChatItem = { topic: 'CHAT.NEW_CHAT', id: 'new', type: ChatType.AiChat };

  selectedChat = this.newChatItem;

  @Input()
  loading = false;

  ngOnInit() {
    this.chats = [this.newChatItem, ...(this.chats ?? [])];
  }
}
