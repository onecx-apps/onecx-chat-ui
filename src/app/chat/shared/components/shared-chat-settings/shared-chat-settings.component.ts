import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-shared-chat-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './shared-chat-settings.component.html',
  styleUrl: './shared-chat-settings.component.scss'
})
export class SharedChatSettingsComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;
  @Input() chatNamePlaceholder = '';
  
  ngOnInit(): void {
    if (!this.form.contains('chatName')) {
      this.form.addControl('chatName', new FormControl('', Validators.required));
    }
  }

  ngOnDestroy(): void {
    if (this.form?.contains('chatName')) {
      this.form.removeControl('chatName');
    }
  }
  
  get chatNameControl() {
    return this.form.get('chatName');
  }
}
