import { Component, Output, EventEmitter, Input, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatOptionButtonComponent } from '../chat-option-button/chat-option-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { Chat } from 'src/app/shared/generated';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-chat-list-screen',
  standalone: true,
  imports: [
    CommonModule,
    ChatHeaderComponent,
    ChatOptionButtonComponent,
    TranslateModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TabViewModule,
    ContextMenuModule
  ],
  templateUrl: './chat-list-screen.component.html',
  styleUrls: ['./chat-list-screen.component.scss'],
})
export class ChatListScreenComponent implements OnInit {
  @Output() selectMode = new EventEmitter<string>();
  @Output() chatSelected = new EventEmitter<Chat>();
  @Output() deleteChat = new EventEmitter<Chat>();
  @Input() chats: Chat[] | undefined;
  @ViewChild('cm') cm!: ContextMenu;
  items: MenuItem[] | undefined;
  selectedChat: Chat | null = null;
  logoUrl = '';

  ngOnInit() {
    this.items = [
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          this.deleteChat.emit(this.selectedChat!);
        }
      },
    ];
  }

  onContextMenu(event: any, chat: Chat) {
    this.selectedChat = chat;
    this.cm.show(event);
  }

  onHide() {
    this.selectedChat = null;
  }
}
