import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-group-chat-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
  ],
  templateUrl: './group-chat-settings.component.html',
  styleUrls: ['./group-chat-settings.component.scss'],
})
export class GroupChatSettingsComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;

  recipientInputControl = new FormControl('');
  recipients: string[] = [];

  ngOnInit() {
    this.recipients = this.form.get('recipients')?.value || [];
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
    this.recipientInputControl.setValue('');
  }

  ngOnDestroy() {
    if (this.form.contains('recipients')) {
      this.form.removeControl('recipients');
    }
  }

  onAddRecipient() {
    const value = this.recipientInputControl.value?.trim();
    if (value && !this.recipients.includes(value)) {
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
