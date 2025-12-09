import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-direct-chat-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    TranslateModule,
  ],
  templateUrl: './direct-chat-settings.component.html',
  styleUrls: ['./direct-chat-settings.component.scss'],
})
export class DirectChatSettingsComponent {
  @Input() formGroup!: FormGroup;
}
