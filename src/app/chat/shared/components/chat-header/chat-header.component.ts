import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss']
})
export class ChatHeaderComponent {
  @Input() title = '';
  @Input() showClose = true;
  @Input() showBack = false;
  @Output() closed = new EventEmitter<void>();
  @Output() backClicked = new EventEmitter<void>();
}
