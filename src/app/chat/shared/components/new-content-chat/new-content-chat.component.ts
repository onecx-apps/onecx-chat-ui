import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-new-content',
  templateUrl: './new-content-chat.component.html',
  styleUrls: ['./new-content-chat.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ChatNewContentComponent {
  @Input() chatName$?: Observable<string>;
  @Input() recipientInput$?: Observable<string>;
  @Input() recipients$?: Observable<string[]>;
  @Input() hideAddButton?: boolean = false;

  @Output() chatNameChange = new EventEmitter<Event>();
  @Output() recipientInputChange = new EventEmitter<Event>();
  @Output() addRecipient = new EventEmitter<string>();
  @Output() removeRecipient = new EventEmitter<number>();
  @Output() createGroup = new EventEmitter<void>();

  today = new Date();
}
