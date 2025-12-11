import { createFeature } from '@ngrx/store';
import { chatAssistantReducer } from './pages/chat-assistant/chat-assistant.reducers';
import { chatSearchReducer } from './pages/chat-search/chat-search.reducers';

// chatAssistant feature
export const chatAssistantFeature = createFeature({
  name: 'chatAssistant',
  reducer: chatAssistantReducer,
});

// chatSearch feature
export const chatSearchFeature = createFeature({
  name: 'chatSearch',
  reducer: chatSearchReducer,
});
