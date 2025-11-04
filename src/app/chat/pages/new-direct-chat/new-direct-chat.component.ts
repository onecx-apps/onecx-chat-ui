import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ChatHeaderComponent } from '../../shared/components/chat-header/chat-header.component';
import { ChatNewContentComponent } from '../../shared/components/chat-new-content/chat-new-content.component';

@Component({
  selector: 'app-new-direct-chat',
  templateUrl: './new-direct-chat.component.html',
  styleUrls: ['./new-direct-chat.component.scss'],
  standalone: true,
  imports: [FormsModule, ChatHeaderComponent, ChatNewContentComponent],
})
export class NewDirectChatComponent {
  @Output() back = new EventEmitter<void>();
  @Output() create = new EventEmitter<{ recipient: string }>();

  // Local state without NGRX - simple for single recipient
  private recipientInputSubject = new BehaviorSubject<string>('');
  
  // Observables for template
  chatName$ = new BehaviorSubject<string>('Direct Chat');
  recipients$ = new BehaviorSubject<string[]>([]); // Always empty for direct chat
  recipientInput$ = this.recipientInputSubject.asObservable();

  onChatNameChange(event: Event) {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.chatName$.next(value);
  }

  onRecipientInputChange(value: string | Event) {
    let inputValue = '';
    if (typeof value === 'string') {
      inputValue = value;
    } else if (value && typeof value === 'object' && 'target' in value) {
      inputValue = (value.target as HTMLInputElement)?.value ?? '';
    }
    this.recipientInputSubject.next(inputValue);
  }

  onAddRecipient() {}

  onRemoveRecipient(index: number) {}

  createDirectChat() {}
}
