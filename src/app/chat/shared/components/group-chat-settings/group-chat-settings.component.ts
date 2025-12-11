import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
export class GroupChatSettingsComponent implements OnInit {
  @Input() formGroup!: FormGroup;

  recipientInputControl = new FormControl('');
  recipients: string[] = [];
  
  get showAddButton(): boolean {
    return !!this.recipientInputControl.value && this.recipientInputControl.value.trim().length > 0;
  }

  ngOnInit() {
    this.recipients = this.formGroup.get('recipients')?.value || [];
    this.recipientInputControl.setValue('');
  }

  onAddRecipient() {
    const value = this.recipientInputControl.value?.trim();
    if (value) {
      this.recipients = [...this.recipients, value];
      this.formGroup.patchValue({ recipients: this.recipients });
      this.recipientInputControl.setValue('');
    }
  }

  onRemoveRecipient(index: number) {
    this.recipients = this.recipients.filter((_, i) => i !== index);
    this.formGroup.patchValue({ recipients: this.recipients });
  }
}
