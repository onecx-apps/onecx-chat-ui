import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChatMessage } from './chat.viewmodel';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    DropdownModule,
    ProgressBarModule,
    ChatComponent,
  ],
})
export class ChatComponent {
  @Input()
  chatMessages: ChatMessage[] = [];

  @Input()
  sendMessageDisabled = false;

  @Output()
  sendMessage = new EventEmitter<string>();

  @Output()
  retrySendMessage = new EventEmitter<string>();

  @ViewChild('scrollContainer') private scrollContainer: ElementRef | undefined;

  public formGroup: FormGroup;

  constructor(private translateService: TranslateService) {
    this.formGroup = new FormGroup({
      message: new FormControl(null, [
        Validators.minLength(1),
        Validators.maxLength(255),
        Validators.required,
      ]),
    });
  }

  sendButtonClicked() {
    if (
      !this.formGroup.value['message'] ||
      this.formGroup.value['message'] === ''
    )
      return;
    this.sendMessage.emit(this.formGroup.value['message']);
    this.formGroup.reset();
  }

  retrySending(msg: ChatMessage) {
    this.retrySendMessage.emit(msg.text);
  }
}
