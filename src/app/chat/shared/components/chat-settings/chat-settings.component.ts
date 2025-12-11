import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { SharedChatSettingsComponent } from '../shared-chat-settings/shared-chat-settings.component';
import { DirectChatSettingsComponent } from '../direct-chat-settings/direct-chat-settings.component';
import { GroupChatSettingsComponent } from '../group-chat-settings/group-chat-settings.component';

export type ChatSettingsType = 'ai' | 'direct' | 'group';

export interface ChatSettingsFormValue {
  chatName: string;
  recipientInput?: string;
  recipients?: string[];
}

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
export class ChatSettingsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() settingsType: ChatSettingsType = 'ai';
  @Input() chatNamePlaceholder: string = '';
  @Output() create = new EventEmitter<ChatSettingsFormValue>();

  private destroy$ = new Subject<void>();
  chatForm!: FormGroup;

  ngOnInit() {
    this.initializeForm();
    this.updateFormForType(this.settingsType);
    this.chatForm.patchValue({ chatName: this.chatNamePlaceholder });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chatForm) {
      if (changes['settingsType']) {
        this.updateFormForType(this.settingsType);
      }
      if (changes['chatNamePlaceholder']) {
        this.chatForm.patchValue({ chatName: this.chatNamePlaceholder });
      }
    }
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
            },
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
    this.create.emit(formValue);
  }

  get chatNameControl() {
    return this.chatForm.get('chatName') as FormControl;
  }
}
