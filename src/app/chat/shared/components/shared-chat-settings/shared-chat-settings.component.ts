import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-shared-chat-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './shared-chat-settings.component.html',
  styleUrl: './shared-chat-settings.component.scss'
})
export class SharedChatSettingsComponent {
  @Input() formGroup!: FormGroup;
  @Input() chatNamePlaceholder = '';
  
  get chatNameControl() {
    return this.formGroup.get('chatName');
  }
}
