import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-chat-new-content',
  templateUrl: './chat-new-content.component.html',
  styleUrls: ['./chat-new-content.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, InputTextModule, ButtonModule]
})
export class ChatNewContentComponent {
  @Input() chatName$!: Observable<string>;
  @Input() recipients$!: Observable<string[]>;
  @Input() recipientInput$!: Observable<string>;
  @Input() hideAddButton = false; // New input to hide add button for direct chat
  @Output() chatNameChange = new EventEmitter<Event>();
  @Output() recipientInputChange = new EventEmitter<Event>();
  @Output() createGroup = new EventEmitter<void>();
  @Output() addRecipient = new EventEmitter<void>();
  @Output() removeRecipient = new EventEmitter<number>();
}
