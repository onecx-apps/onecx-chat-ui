import { createFeatureSelector } from '@ngrx/store';
import { chatFeature } from './chat.reducers';
import { ChatState } from './chat.state';

export const selectChatFeature = createFeatureSelector<ChatState>(
  chatFeature.name
);