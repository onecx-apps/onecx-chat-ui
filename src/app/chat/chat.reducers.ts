import { combineReducers, createFeature } from '@ngrx/store';
import { ChatState } from './chat.state';
import { chatAssistantReducer } from './pages/chat-assistant/chat-assistant.reducers';
import { chatSearchReducer } from './pages/chat-search/chat-search.reducers';
import { chatNewGroupReducer } from './pages/chat-new-group/chat-new-group.reducer';

export const chatFeature = createFeature({
  name: 'chat',
  reducer: combineReducers<ChatState>({
    search: chatSearchReducer,
    assistant: chatAssistantReducer,
    newGroup: chatNewGroupReducer,
  }),
});
