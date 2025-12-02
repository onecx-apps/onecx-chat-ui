import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatHeaderComponent } from '../../shared/components/chat-header/chat-header.component';
import { ChatNewContentComponent } from '../../shared/components/new-content-chat/new-content-chat.component';
import * as ChatNewGroupActions from '../new-group-chat/new-group-chat.actions';
import * as ChatNewGroupSelectors from '../new-group-chat/new-group-chat.selectors';

@Component({
  selector: 'app-new-direct-chat',
  templateUrl: './new-direct-chat.component.html',
  styleUrls: ['./new-direct-chat.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ChatHeaderComponent, ChatNewContentComponent],
})
export class NewDirectChatComponent {
  @Output() back = new EventEmitter<void>();

  chatName$: Observable<string>;
  recipientInput$: Observable<string>;
  recipients$: Observable<string[]>;

  constructor(private store: Store) {
    this.chatName$ = this.store.select(ChatNewGroupSelectors.selectChatName);
    this.recipientInput$ = this.store.select(ChatNewGroupSelectors.selectRecipientInput);
    this.recipients$ = this.store.select(ChatNewGroupSelectors.selectRecipients);
  }

  onRecipientInputChange(event: Event) {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.store.dispatch(ChatNewGroupActions.setRecipientInput({ recipientInput: value }));
  }

  onAddRecipient(): void {
    this.store.dispatch(ChatNewGroupActions.addRecipient({ recipient: '' }));
  }

  onRemoveRecipient(index: number): void {
    this.store.dispatch(ChatNewGroupActions.removeRecipient({ index }));
  }
}
