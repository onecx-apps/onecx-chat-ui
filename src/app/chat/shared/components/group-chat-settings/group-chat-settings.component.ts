import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-group-chat-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule,
    TranslateModule,
  ],
  templateUrl: './group-chat-settings.component.html',
  styleUrls: ['./group-chat-settings.component.scss'],
})
export class GroupChatSettingsComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;

  recipientInputControl = new FormControl('');
  recipients: string[] = [];
  
  get showAddButton(): boolean {
    return !!this.recipientInputControl.value && this.recipientInputControl.value.trim().length > 0;
  }

  ngOnInit() {
    if (!this.form.contains('recipients')) {
      this.form.addControl(
        'recipients',
        new FormControl([], [
          Validators.required,
          (control) => {
            const value = control.value;
            return Array.isArray(value) && value.length > 0 ? null : { minLength: true };
          },
        ])
      );
    }
    
    this.recipients = this.form.get('recipients')?.value || [];
    this.recipientInputControl.setValue('');
  }

  ngOnDestroy() {
    if (this.form.contains('recipients')) {
      this.form.removeControl('recipients');
    }
  }

  onAddRecipient() {
    const value = this.recipientInputControl.value?.trim();
    if (value) {
      this.recipients = [...this.recipients, value];
      this.form.patchValue({ recipients: this.recipients });
      this.recipientInputControl.setValue('');
    }
  }

  onRemoveRecipient(index: number) {
    this.recipients = this.recipients.filter((_, i) => i !== index);
    this.form.patchValue({ recipients: this.recipients });
  }
}
