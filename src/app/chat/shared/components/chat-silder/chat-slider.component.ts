import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-chat-slider',
  standalone: true,
  imports: [CommonModule, SidebarModule],
  templateUrl: './chat-slider.component.html',
  styleUrls: ['./chat-slider.component.scss']
})
export class ChatSliderComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() modal = false;
  @Input() showCloseIcon = false;
  @Input() closeOnEscape = true;
  @Input() position: 'left' | 'right' = 'right';
  @Input() styleClass = '';

  @Output() hide = new EventEmitter<void>();
}
