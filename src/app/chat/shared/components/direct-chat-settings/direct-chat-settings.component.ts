import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
export class DirectChatSettingsComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;

  ngOnInit() {
    if (!this.form.contains('recipientInput')) {
      this.form.addControl('recipientInput', new FormControl('', [Validators.required]));
    }
  }

  ngOnDestroy() {
    if (this.form.contains('recipientInput')) {
      this.form.removeControl('recipientInput');
    }
  }

  get recipientInputControl() {
    return this.form.get('recipientInput');
  }
}
