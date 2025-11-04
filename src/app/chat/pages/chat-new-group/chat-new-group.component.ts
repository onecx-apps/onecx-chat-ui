import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ChatHeaderComponent } from '../../shared/components/chat-header/chat-header.component';
import { ChatNewContentComponent } from '../../shared/components/chat-new-content/chat-new-content.component';
import * as ChatNewGroupActions from './chat-new-group.actions';
import * as ChatNewGroupSelectors from './chat-new-group.selectors';

@Component({
  selector: 'app-chat-new-group',
  templateUrl: './chat-new-group.component.html',
  styleUrls: ['./chat-new-group.component.scss'],
  standalone: true,
  imports: [FormsModule, ChatHeaderComponent, ChatNewContentComponent],
})
export class ChatNewGroupComponent {
  @Output() back = new EventEmitter<void>();
  @Output() create = new EventEmitter<{ name: string; recipients: string[] }>();

  chatName$: Observable<string>;
  recipientInput$: Observable<string>;
  recipients$: Observable<string[]>;

  constructor(private store: Store) {
    this.chatName$ = this.store.select(ChatNewGroupSelectors.selectChatName);
    this.recipientInput$ = this.store.select(ChatNewGroupSelectors.selectRecipientInput);
    this.recipients$ = this.store.select(ChatNewGroupSelectors.selectRecipients);
  }

  onChatNameChange(event: Event) {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.store.dispatch(ChatNewGroupActions.setChatName({ chatName: value }));
  }

  onRecipientInputChange(value: string | Event) {
    let inputValue = '';
    if (typeof value === 'string') {
      inputValue = value;
    } else if (value && typeof value === 'object' && 'target' in value) {
      inputValue = (value.target as HTMLInputElement)?.value ?? '';
    }
    this.store.dispatch(ChatNewGroupActions.setRecipientInput({ recipientInput: inputValue }));
  }

  onAddRecipient() {
    this.store.dispatch(ChatNewGroupActions.addRecipient());
  }

  onRemoveRecipient(index: number) {
    this.store.dispatch(ChatNewGroupActions.removeRecipient({ index }));
  }

  async createGroup() {}
}
