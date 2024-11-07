import { Routes } from '@angular/router';
import { ChatSearchComponent } from './pages/chat-search/chat-search.component';
import { ChatAssistantComponent } from './pages/chat-assistant/chat-assistant.component';

export const routes: Routes = [
  { path: '', component: ChatSearchComponent, pathMatch: 'full' },
  {
    path: 'chat-assistant',
    component: ChatAssistantComponent,
    pathMatch: 'full',
  },
];
