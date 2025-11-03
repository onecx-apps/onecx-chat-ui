import { Routes } from '@angular/router';
import { ChatAssistantComponent } from './pages/chat-assistant/chat-assistant.component';
import { ChatSearchComponent } from './pages/chat-search/chat-search.component';
import { ChatNewGroupComponent } from './pages/chat-new-group/chat-new-group.component';

export const routes: Routes = [
  { path: '', component: ChatSearchComponent, pathMatch: 'full' },
  {
    path: 'chat-assistant',
    component: ChatAssistantComponent,
    pathMatch: 'full',
  },
  {
    path: 'new-group-chat',
    component: ChatNewGroupComponent,
    pathMatch: 'full',
  },
];
