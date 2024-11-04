import { Routes } from '@angular/router';
import { ChatSearchComponent } from './pages/chat-search/chat-search.component';

export const routes: Routes = [
  { path: '', component: ChatSearchComponent, pathMatch: 'full' },
];
