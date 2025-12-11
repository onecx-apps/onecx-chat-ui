import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ChatAssistantActions } from '../../../pages/chat-assistant/chat-assistant.actions';
import { selectSelectedChatMode } from '../../../pages/chat-assistant/chat-assistant.selectors';
import { selectChatNamePlaceholder } from './chat-settings.selectors';
import { SharedChatSettingsComponent } from '../shared-chat-settings/shared-chat-settings.component';
import { DirectChatSettingsComponent } from '../direct-chat-settings/direct-chat-settings.component';
import { GroupChatSettingsComponent } from '../group-chat-settings/group-chat-settings.component';

export type ChatSettingsType = 'ai' | 'direct' | 'group';

export interface ChatSettingsFormValue {
  chatName: string;
  recipientInput?: string;
  recipients?: string[];
}

/**
 * SMART COMPONENT: Chat Settings (Aggregator)
 * 
 * Structure:
 * - ALWAYS renders: SharedChatSettingsComponent (DUMB) - common settings (chat name)
 * - CONDITIONALLY renders based on chat mode:
 *   - AiChatSettingsComponent (DUMB) - when mode = 'ai'
 *   - DirectChatSettingsComponent (DUMB) - when mode = 'direct'
 *   - GroupChatSettingsComponent (DUMB) - when mode = 'group'
 */
@Component({
  selector: 'app-chat-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedChatSettingsComponent,
    DirectChatSettingsComponent,
    GroupChatSettingsComponent,
  ],
  templateUrl: './chat-settings.component.html',
  styleUrls: ['./chat-settings.component.scss'],
})
export class ChatSettingsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  settingsType$: Observable<ChatSettingsType>;
  chatNamePlaceholder$: Observable<string>;
  currentChatMode: ChatSettingsType = 'ai';
  
  chatForm!: FormGroup;

  constructor(private store: Store) {
    this.settingsType$ = this.store.select(selectSelectedChatMode).pipe(
      map(mode => (mode as ChatSettingsType) || 'ai')
    );
    
    this.chatNamePlaceholder$ = this.store.select(selectChatNamePlaceholder);
  }

  ngOnInit() {
    this.initializeForm();
    
    this.settingsType$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => {
        this.currentChatMode = type;
        this.updateFormForType(type);
      });
    
    this.chatNamePlaceholder$
      .pipe(takeUntil(this.destroy$))
      .subscribe(placeholder => {
        this.chatForm.patchValue({ chatName: placeholder });
      });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.chatForm = new FormGroup({
      chatName: new FormControl('', [Validators.maxLength(50)]),
    });
  }
  
  private updateFormForType(type: ChatSettingsType) {
    const recipientInputExists = this.chatForm.contains('recipientInput');
    const recipientsExists = this.chatForm.contains('recipients');
    
    if (type === 'direct') {
      if (recipientsExists) {
        this.chatForm.removeControl('recipients');
      }
      if (!recipientInputExists) {
        this.chatForm.addControl(
          'recipientInput',
          new FormControl('', [Validators.required])
        );
      }
    } else if (type === 'group') {
      if (recipientInputExists) {
        this.chatForm.removeControl('recipientInput');
      }
      if (!recipientsExists) {
        this.chatForm.addControl(
          'recipients',
          new FormControl([], [
            Validators.required,
            (control) => {
              const value = control.value;
              return Array.isArray(value) && value.length > 0 ? null : { minLength: true };
            }
          ])
        );
      }
    } else {
      if (recipientInputExists) {
        this.chatForm.removeControl('recipientInput');
      }
      if (recipientsExists) {
        this.chatForm.removeControl('recipients');
      }
    }
  }

  onCreate(): void {
    if (this.chatForm.invalid) {
      this.chatForm.markAllAsTouched();
      return;
    }

    const formValue = this.chatForm.value as ChatSettingsFormValue;
    const chatName = formValue.chatName?.trim() || '';
    
    this.store.dispatch(ChatAssistantActions.chatCreateButtonClicked({
      chatName,
      chatMode: this.currentChatMode,
      recipientUserId: formValue.recipientInput,
      participants: formValue.recipients,
    }));
  }

  get chatNameControl() {
    return this.chatForm.get('chatName') as FormControl;
  }
}
