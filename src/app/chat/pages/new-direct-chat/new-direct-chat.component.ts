import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ChatHeaderComponent } from '../../shared/components/chat-header/chat-header.component';
import { ChatNewContentComponent } from '../../shared/components/new-content-chat/new-content-chat.component';

@Component({
  selector: 'app-new-direct-chat',
  templateUrl: './new-direct-chat.component.html',
  styleUrls: ['./new-direct-chat.component.scss'],
  standalone: true,
  imports: [FormsModule, ChatHeaderComponent, ChatNewContentComponent],
})
export class NewDirectChatComponent {
  @Output() back = new EventEmitter<void>();

  private readonly recipientInputSubject = new BehaviorSubject<string>('');
  
  chatName$ = new BehaviorSubject<string>('Direct Chat');
  recipients$ = new BehaviorSubject<string[]>([]);
  recipientInput$ = this.recipientInputSubject.asObservable();

  onRecipientInputChange(event: Event) {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.recipientInputSubject.next(value);
  }

  onAddRecipient(): void {
    // intentionally empty
  }

  onRemoveRecipient(_index: number): void {
    // intentionally empty
}
}
