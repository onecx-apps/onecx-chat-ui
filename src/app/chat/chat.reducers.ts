import { createFeature } from '@ngrx/store';
import { chatAssistantReducer } from './pages/chat-assistant/chat-assistant.reducers';
import { chatSearchReducer } from './pages/chat-search/chat-search.reducers';
import { chatSettingsReducer } from './shared/components/chat-settings/chat-settings.reducers';

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

// chatSettings feature
export const chatSettingsFeature = createFeature({
  name: 'chatSettings',
  reducer: chatSettingsReducer,
});
