import { createSelector } from '@ngrx/store';
import { createChildSelectors } from '@onecx/ngrx-accelerator';
import { Chat } from 'src/app/shared/generated';
import { chatFeature } from '../../chat.reducers';
import { initialState } from './chat-assistant.reducers';
import { ChatAssistantViewModel } from './chat-assistant.viewmodel';

export const chatAssistantSelectors = createChildSelectors(
  chatFeature.selectAssistant,
  initialState
);

export const selectChatAssistantViewModel = createSelector(
  chatAssistantSelectors.selectChats,
  (chats: Chat[]): ChatAssistantViewModel => ({
    chats,
  })
);
