import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatHeaderComponent } from '../../shared/components/chat-header/chat-header.component';
import { NewChatComponent } from '../../shared/components/new-chat/new-chat.component';

@Component({
  selector: 'app-new-direct-chat',
  templateUrl: './new-direct-chat.component.html',
  styleUrls: ['./new-direct-chat.component.scss'],
  standalone: true,
  imports: [CommonModule, ChatHeaderComponent, NewChatComponent],
})
export class NewDirectChatComponent {
  @Output() back = new EventEmitter<void>();

  onCreateDirectChat(): void {
    // TODO: Implement direct chat creation logic
  }
}
