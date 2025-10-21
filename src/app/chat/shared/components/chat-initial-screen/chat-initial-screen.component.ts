import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatOptionButtonComponent } from '../chat-option-button/chat-option-button.component';

@Component({
  selector: 'app-chat-initial-screen',
  standalone: true,
  imports: [CommonModule, ChatHeaderComponent, ChatOptionButtonComponent],
  templateUrl: './chat-initial-screen.component.html',
  styleUrls: ['./chat-initial-screen.component.scss']
})
export class ChatInitialScreenComponent {
  @Output() selectMode = new EventEmitter<string>();
  ASSETS_URL = environment.ASSETS_URL;
}
