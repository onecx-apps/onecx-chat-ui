import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { Chat, ChatType } from '../../generated';
import { MenuModule } from 'primeng/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TranslateModule,
    DropdownModule,
    ProgressBarModule,
    MenuModule,
  ],
})
export class ChatListComponent {
  @Input()
  chats: Chat[] | undefined;

  @Input()
  selectedChat: Chat | undefined;

  @Input()
  loading = false;

  @Input()
  menuItems: MenuItem[] | undefined;

  @Output()
  chatSelected = new EventEmitter<Chat>();

  onChange({ value }: { value: Chat }) {
    this.chatSelected.emit(value);
  }
}
