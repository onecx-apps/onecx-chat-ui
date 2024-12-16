import { combineReducers, createFeature } from '@ngrx/store';
import { chatComponentReducer } from './chat-component/chat-component.reducer';
import { ChatState } from './chat.state';

export const chatComponentFeature = createFeature({
  name: 'chatComponent',
  reducer: combineReducers<ChatState>({
    chat: chatComponentReducer,
  }),
});
