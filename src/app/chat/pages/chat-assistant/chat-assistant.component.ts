import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { ChatAssistantActions } from './chat-assistant.actions';
import { environment } from 'src/environments/environment';
import { ChatSliderComponent } from '../../shared/components/chat-silder/chat-slider.component';
import { ChatInitialScreenComponent } from '../../shared/components/chat-initial-screen/chat-initial-screen.component';
import { ChatSettingsComponent, ChatSettingsType, ChatSettingsFormValue } from '../../shared/components/chat-settings/chat-settings.component';
import { ChatHeaderComponent } from '../../shared/components/chat-header/chat-header.component';
import { Observable } from 'rxjs';
import { selectSelectedChatMode } from './chat-assistant.selectors';
import { generatePlaceholder } from './chat-assistant.utils';

type CurrentPage = 'initial' | 'newChat' | null;

@Component({
  selector: 'app-chat-assistant',
  templateUrl: './chat-assistant.component.html',
  styleUrls: ['./chat-assistant.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    SidebarModule,
    TranslateModule,
    SharedModule,
    TooltipModule,
    ChatSliderComponent,
    ChatInitialScreenComponent,
    ChatSettingsComponent,
    ChatHeaderComponent,
  ],
})
export class ChatAssistantComponent implements OnChanges {
  environment = environment;
  _sidebarVisible = false;
  currentPage: CurrentPage = 'initial';
  selectedChatMode$: Observable<string | null>;
  currentChatMode: string | null = null;
  chatNamePlaceholder = '';

  @Input()
  set sidebarVisible(val: boolean) {
    if (val) {
      this.store.dispatch(ChatAssistantActions.chatPanelOpened());
      if (!this.currentPage) {
        this.currentPage = 'initial';
      }
    }
    this._sidebarVisible = val;
  }

  @Output() sidebarVisibleChange = new EventEmitter<boolean>();

  constructor(private readonly store: Store) {
    this.selectedChatMode$ = this.store.select(selectSelectedChatMode);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sidebarVisible']) {
      this.sidebarVisibleChange.emit(changes['sidebarVisible'].currentValue);
    }
  }

  closeSidebar() {
    this._sidebarVisible = false;
    this.sidebarVisibleChange.emit(false);
    this.currentPage = 'initial';
    this.store.dispatch(ChatAssistantActions.chatPanelClosed());
  }

  onChatModeSelected(mode: string) {
    if (mode === 'close') {
      this.closeSidebar();
      return;
    }
    this.currentChatMode = mode;
    this.store.dispatch(ChatAssistantActions.chatModeSelected({ mode }));
    this.currentPage = 'newChat';
    this.chatNamePlaceholder = generatePlaceholder(mode as ChatSettingsType);
  }

  onBackFromNewChat() {
    this.currentPage = 'initial';
    this.currentChatMode = null;
    this.store.dispatch(ChatAssistantActions.chatModeDeselected());
  }

  onCreateChat(formValue: ChatSettingsFormValue) {
    const chatName = formValue.chatName?.trim() || this.chatNamePlaceholder;
    this.store.dispatch(ChatAssistantActions.chatCreateButtonClicked({
      chatName,
      chatMode: this.currentChatMode || 'ai',
      recipientUserId: formValue.recipientInput,
      participants: formValue.recipients,
    }));
    this.currentPage = 'initial';
    this.currentChatMode = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this._sidebarVisible) {
      return;
    }

    const clickedElement = event.target as HTMLElement;
    
    const isInsideSidebar = clickedElement.closest('.p-sidebar') || 
                           clickedElement.closest('[role="complementary"]') ||
                           clickedElement.closest('app-chat-slider') ||
                           clickedElement.closest('app-chat-initial-screen') ||
                           clickedElement.closest('app-chat-option-button') ||
                           clickedElement.closest('app-chat-header') ||
                           clickedElement.closest('app-chat-settings') ||
                           clickedElement.closest('.new-chat-wrapper') ||
                           clickedElement.closest('.add-recipient-btn') ||
                           clickedElement.closest('.remove-recipient-btn');
    
    if (isInsideSidebar) {
      return;
    }
    
    const isChatToggleButton = clickedElement.closest('[aria-label*="Chat"]') || 
                               clickedElement.closest('.chat-toggle-button') ||
                               clickedElement.closest('.chat-button') ||
                               clickedElement.id === 'chat-toggle-button';
    
    if (!isChatToggleButton) {
      this.closeSidebar();
    }
  }
}