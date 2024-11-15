import { createSelector } from '@ngrx/store';
import { createChildSelectors } from '@onecx/ngrx-accelerator';
import { Chat, Message } from 'src/app/shared/generated';
import { chatFeature } from '../../chat.reducers';
import { initialState } from './chat-assistant.reducers';
import { ChatAssistantViewModel } from './chat-assistant.viewmodel';

export const chatAssistantSelectors = createChildSelectors(
  chatFeature.selectAssistant,
  initialState
);

export const selectChatAssistantViewModel = createSelector(
  chatAssistantSelectors.selectChats,
  chatAssistantSelectors.selectCurrentChat,
  chatAssistantSelectors.selectCurrentMessages,
  (
    chats: Chat[],
    currentChat: Chat | undefined,
    currentMessages: Message[] | undefined
  ): ChatAssistantViewModel => ({
    chats,
    currentChat,
    currentMessages: currentMessages?.map((m) => ({
      ...m,
      id: m.id ?? '',
      text: m.text ?? '',
      userName: m.userName ?? '',
      creationDate: new Date(m.creationDate ?? ''),
    })),
  })
);
