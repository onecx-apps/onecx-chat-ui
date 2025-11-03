import { Routes } from '@angular/router';
import { ChatAssistantComponent } from './pages/chat-assistant/chat-assistant.component';
import { ChatSearchComponent } from './pages/chat-search/chat-search.component';

export const routes: Routes = [
  { path: '', component: ChatSearchComponent, pathMatch: 'full' },
  {
    path: 'chat-assistant',
    component: ChatAssistantComponent,
    pathMatch: 'full',
  },
];
