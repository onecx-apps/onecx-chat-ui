import { combineReducers, createFeature } from '@ngrx/store';
import { ChatState } from './chat.state';
import { chatAssistantReducer } from './pages/chat-assistant/chat-assistant.reducers';
import { ChatAssistantState } from './pages/chat-assistant/chat-assistant.state';
import { chatSearchReducer } from './pages/chat-search/chat-search.reducers';
import { directChatReducer } from './pages/new-direct-chat/new-direct-chat.reducers';

export const chatFeature = createFeature({
  name: 'chat',
  reducer: combineReducers<ChatState>({
    search: chatSearchReducer,
    assistant: chatAssistantReducer,
    direct: directChatReducer,
  }),
});

export interface GlobalChatAssistantState {
  assistant: ChatAssistantState;
}

export const chatAssistantFeature = createFeature({
  name: 'chat',
  reducer: combineReducers<GlobalChatAssistantState>({
    assistant: chatAssistantReducer,
  }),
});
