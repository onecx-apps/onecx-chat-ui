import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-ai-chat-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    SliderModule,
    TranslateModule,
  ],
  template: ``,
  styles: []
})
export class AiChatSettingsComponent {
  @Input() formGroup!: FormGroup;

  aiModels = [
    { label: 'GPT-4', value: 'gpt-4' },
    { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
    { label: 'Claude 3', value: 'claude-3' },
  ];
}
