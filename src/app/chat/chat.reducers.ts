import { combineReducers, createFeature } from '@ngrx/store';
import { ChatState } from './chat.state';
import { chatSearchReducer } from './pages/chat-search/chat-search.reducers';

export const chatFeature = createFeature({
  name: 'chat',
  reducer: combineReducers<ChatState>({
    search: chatSearchReducer,
  }),
});
