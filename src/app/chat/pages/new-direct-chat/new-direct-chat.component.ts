import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatHeaderComponent } from '../../shared/components/chat-header/chat-header.component';
import { ChatNewContentComponent } from '../../shared/components/new-content-chat/new-content-chat.component';
import * as DirectChatActions from './new-direct-chat.actions';
import * as DirectChatSelectors from './new-direct-chat.selectors';

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

  constructor(private store: Store) {
    this.chatName$ = this.store.select(DirectChatSelectors.selectChatName);
    this.recipientInput$ = this.store.select(DirectChatSelectors.selectRecipientInput);
  }

  onRecipientInputChange(event: Event) {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.store.dispatch(DirectChatActions.setRecipientInput({ recipientInput: value }));
  }
}
