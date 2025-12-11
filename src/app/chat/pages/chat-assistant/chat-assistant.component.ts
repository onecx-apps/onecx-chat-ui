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
  ],
})
export class ChatAssistantComponent implements OnChanges {
  environment = environment;
  _sidebarVisible = false;

  @Input()
  set sidebarVisible(val: boolean) {
    if (val) {
      this.store.dispatch(ChatAssistantActions.chatPanelOpened());
    }
    this._sidebarVisible = val;
  }

  @Output() sidebarVisibleChange = new EventEmitter<boolean>();

  constructor(private readonly store: Store) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sidebarVisible']) {
      this.sidebarVisibleChange.emit(changes['sidebarVisible'].currentValue);
    }
  }

  closeSidebar() {
    this._sidebarVisible = false;
    this.sidebarVisibleChange.emit(false);
    this.store.dispatch(ChatAssistantActions.chatPanelClosed());
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this._sidebarVisible) {
      return;
    }

    const clickedElement = event.target as HTMLElement;
    
    // Check if clicked INSIDE sidebar - if so, do nothing
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
    
    // Check if clicked on chat TOGGLE button - if so, let the toggle manage the state
    const isChatToggleButton = clickedElement.closest('[aria-label*="Chat"]') || 
                               clickedElement.closest('.chat-toggle-button') ||
                               clickedElement.closest('.chat-button') ||
                               clickedElement.id === 'chat-toggle-button';
    
    if (!isChatToggleButton) {
      this.closeSidebar();
    }
  }
}