import { Component, Output, EventEmitter, Input, ViewChild, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatOptionButtonComponent } from '../chat-option-button/chat-option-button.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { Chat } from 'src/app/shared/generated';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-chat-list-screen',
  standalone: true,
  imports: [
    AvatarModule,
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
  providers: [
    DatePipe
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

  constructor(
    private readonly datePipe: DatePipe,
    private readonly translate: TranslateService
  ) {}

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

  formatLastMessageTime(modificationDate: string | undefined): Observable<string> {
    if (!modificationDate) return of('');

    const messageDate = new Date(modificationDate);
    const diffDays = this.getDaysDifference(messageDate);

    if (diffDays < 1) {
      const formatted = this.datePipe.transform(messageDate, 'shortTime') || '';
      return of(formatted);
    } else if (diffDays < 2) {
      return this.translate.get('CHAT.TIME.YESTERDAY');
    } else if (diffDays < 7) {
      const dayName = this.datePipe.transform(messageDate, 'EEEE') || '';
      const dayKey = dayName.toUpperCase();
      if (!dayKey) return of('');
      return this.translate.get(`CHAT.TIME.${dayKey}`);
    }

    const formatted = this.datePipe.transform(messageDate, 'shortDate') || '';
    return of(formatted);
  }

  private getDaysDifference(date: Date): number {
    const now = new Date();
    return (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  }
}