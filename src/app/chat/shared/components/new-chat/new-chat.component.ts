import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import * as NewChatActions from './new-chat.actions';
import * as NewChatSelectors from './new-chat.selectors';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export type ChatType = 'direct' | 'group' | 'ai';

@Component({
  selector: 'app-new-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss'],
})
export class NewChatComponent implements OnInit, OnDestroy {
  @Input() chatType: ChatType = 'direct';
  @Output() createChat = new EventEmitter<void>();

  chatForm!: FormGroup;

  private destroy$ = new Subject<void>();
  today = new Date();

  constructor(
    private readonly store: Store,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.syncFormWithStore();
    this.setupFormValueChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.chatForm = this.fb.group({
      chatName: [''],
      recipientInput: ['', Validators.required]
    });
  }

  private syncFormWithStore(): void {
    if (this.chatType === 'direct') {
      this.store.select(NewChatSelectors.selectDirectChatName)
        .pipe(takeUntil(this.destroy$))
        .subscribe(chatName => this.chatForm.patchValue({ chatName }, { emitEvent: false }));
      
      this.store.select(NewChatSelectors.selectDirectRecipientInput)
        .pipe(takeUntil(this.destroy$))
        .subscribe(recipientInput => this.chatForm.patchValue({ recipientInput }, { emitEvent: false }));
    } 
  }

  private setupFormValueChanges(): void {
    this.chatForm.get('chatName')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (this.chatType === 'direct') {
          this.store.dispatch(NewChatActions.setDirectChatName({ chatName: value }));
        } else if (this.chatType === 'group') {
          this.store.dispatch(NewChatActions.setGroupChatName({ chatName: value }));
        } else if (this.chatType === 'ai') {
          this.store.dispatch(NewChatActions.setAIChatName({ chatName: value }));
        }
      });

    this.chatForm.get('recipientInput')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (this.chatType === 'direct') {
          this.store.dispatch(NewChatActions.setDirectRecipientInput({ recipientInput: value }));
        } 
      });
  }

  get showChatNameInput(): boolean {
    return this.chatType === 'direct' || this.chatType === 'group';
  }

  get chatNamePlaceholder(): string {
    if (this.chatType === 'direct') {
      return this.translate.instant('CHAT.INPUT.DIRECT_CHAT_PLACEHOLDER', { date: this.today.toLocaleDateString() });
    }
    return this.translate.instant('CHAT.INPUT.GROUP_CHAT_PLACEHOLDER', { date: this.today.toLocaleDateString() });
  }

  get recipientLabel(): string {
    return this.chatType === 'direct'
      ? this.translate.instant('CHAT.INPUT.RECIPIENT')
      : this.translate.instant('CHAT.INPUT.RECIPIENTS');
  }

  onCreate(): void {
    if (this.chatForm.valid) {
      this.createChat.emit();
    }
  }
}
