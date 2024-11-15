import { createSelector } from '@ngrx/store';
import { createChildSelectors } from '@onecx/ngrx-accelerator';
import { NEW_AI_CHAT_ITEM } from 'src/app/shared/components/chat-list/chat-list.component';
import { ChatMessage } from 'src/app/shared/components/chat/chat.viewmodel';
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
    chats: [NEW_AI_CHAT_ITEM, ...chats],
    currentChat: currentChat ?? NEW_AI_CHAT_ITEM,
    currentMessages: currentMessages
      ?.map(
        (m) =>
          ({
            ...m,
            id: m.id ?? '',
            text: m.text ?? '',
            userName: m.userName ?? '',
            userNameKey: `CHAT.PARTICIPANT.${m.type.toUpperCase()}`,
            creationDate: new Date(m.creationDate ?? ''),
          } as ChatMessage)
      )
      .sort((a, b) => a.creationDate.getTime() - b.creationDate.getTime()),
  })
);
