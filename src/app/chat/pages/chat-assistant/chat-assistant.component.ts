import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem, SharedModule } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { combineLatest, map, Observable } from 'rxjs';
import { ChatListComponent } from 'src/app/shared/components/chat-list/chat-list.component';
import { ChatComponent } from 'src/app/shared/components/chat/chat.component';
import { Chat } from 'src/app/shared/generated';
import { ChatAssistantActions } from './chat-assistant.actions';
import { selectChatAssistantViewModel } from './chat-assistant.selectors';
import { ChatAssistantViewModel } from './chat-assistant.viewmodel';

@Component({
  selector: 'app-chat-assistant',
  templateUrl: './chat-assistant.component.html',
  styleUrls: ['./chat-assistant.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LetDirective,
    CalendarModule,
    SidebarModule,
    TranslateModule,
    SharedModule,
    ChatComponent,
    ChatListComponent,
    TooltipModule,
  ],
})
export class ChatAssistantComponent implements OnChanges {
  viewModel$: Observable<ChatAssistantViewModel> = this.store.select(
    selectChatAssistantViewModel,
  );

  _sidebarVisible = false;

  @Input()
  set sidebarVisible(val: boolean) {
    if (val) {
      this.store.dispatch(ChatAssistantActions.chatPanelOpened());
    }
    this._sidebarVisible = val;
  }

  @Output() sidebarVisibleChange = new EventEmitter<boolean>();

  constructor(
    private readonly store: Store,
    private translateService: TranslateService,
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
    }),
  );

  sendMessage(message: string) {
    this.store.dispatch(
      ChatAssistantActions.messageSent({
        message,
      }),
    );
  }

  chatSelected(chat: Chat) {
    this.store.dispatch(
      ChatAssistantActions.chatSelected({
        chat,
      }),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sidebarVisible']) {
      this.sidebarVisibleChange.emit(this.sidebarVisible);
    }
  }
}
