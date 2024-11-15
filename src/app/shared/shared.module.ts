import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ChatComponent } from './components/chat/chat.component';

@NgModule({
  declarations: [ChatComponent, ChatListComponent],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    DropdownModule,
    ProgressBarModule,
  ],
  exports: [ChatComponent, ChatListComponent],
  providers: [],
})
export class SharedModule {}
