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
import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from 'src/environments/environment';
import { ChatSliderComponent } from '../../shared/components/chat-silder/chat-slider.component';
import { ChatHeaderComponent } from '../../shared/components/chat-header/chat-header.component';
import { ChatOptionButtonComponent } from '../../shared/components/chat-option-button/chat-option-button.component';
import { ChatInitialScreenComponent } from '../../shared/components/chat-initial-screen/chat-initial-screen.component';

@Component({
  selector: 'app-chat-assistant',
  templateUrl: './chat-assistant.component.html',
  styleUrls: ['./chat-assistant.component.scss'],
  standalone: true,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ])
  ],
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
    ChatSliderComponent,
    ChatHeaderComponent,
    ChatOptionButtonComponent,
    ChatInitialScreenComponent,
  ],
})
export class ChatAssistantComponent implements OnChanges {
  environment = environment;
  viewModel$: Observable<ChatAssistantViewModel>;
  menuItems: Observable<MenuItem[]>;

  _sidebarVisible = false;
  selectedChatMode: string | null = null;

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
  ) {
    this.viewModel$ = this.store.select(selectChatAssistantViewModel);
    
    this.menuItems = combineLatest([
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
  }

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

  // NEW METHODS ONECX COMPANION
  selectChatMode(mode: string) {
    if (mode === 'close') {
      this._sidebarVisible = false;
      this.sidebarVisibleChange.emit(false);
      this.selectedChatMode = null;
      return;
    }
    this.selectedChatMode = mode;
  }

  goBack() {
    this.selectedChatMode = null;
  }

  getChatTitle(): string {
    switch (this.selectedChatMode) {
      case 'ai':
        return 'AI Companion';
      case 'direct':
        return 'Direct Chat';
      case 'group':
        return 'Group Chat';
      default:
        return 'Chat';
    }
  }
}
