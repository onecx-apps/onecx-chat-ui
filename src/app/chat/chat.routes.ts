import { Routes } from '@angular/router';
import { ChatSearchComponent } from './pages/chat-search/chat-search.component';
import { FullChatComponent } from './pages/full-chat/full-chat.component';

export const routes: Routes = [
  { path: '', component: ChatSearchComponent, pathMatch: 'full' },
  { path: 'full-chat', component: FullChatComponent, pathMatch: 'full' },
];
