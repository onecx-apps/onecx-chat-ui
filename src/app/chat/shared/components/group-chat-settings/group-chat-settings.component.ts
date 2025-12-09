import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private recipientsSubject = new BehaviorSubject<string[]>([]);
  recipients$: Observable<string[]> = this.recipientsSubject.asObservable();
  
  get showAddButton(): boolean {
    return !!this.recipientInputControl.value && this.recipientInputControl.value.trim().length > 0;
  }

  ngOnInit() {
    const initialRecipients = this.formGroup.get('recipients')?.value || [];
    this.recipientsSubject.next(initialRecipients);
    this.recipientInputControl.setValue('');
  }

  onAddRecipient() {
    const value = this.recipientInputControl.value?.trim();
    if (value) {
      const currentRecipients = this.recipientsSubject.value;
      const updatedRecipients = [...currentRecipients, value];
      this.recipientsSubject.next(updatedRecipients);
      this.formGroup.patchValue({ recipients: updatedRecipients });
      this.recipientInputControl.setValue('');
    }
  }

  onRemoveRecipient(index: number) {
    const currentRecipients = this.recipientsSubject.value;
    const updatedRecipients = currentRecipients.filter((_, i) => i !== index);
    this.recipientsSubject.next(updatedRecipients);
    this.formGroup.patchValue({ recipients: updatedRecipients });
  }
}
