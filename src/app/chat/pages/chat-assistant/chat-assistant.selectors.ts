import { createSelector } from '@ngrx/store';
import { createChildSelectors } from '@onecx/ngrx-accelerator';
import { NEW_AI_CHAT_ITEM } from 'src/app/shared/components/chat-list/chat-list.component';
import { ChatMessage } from 'src/app/shared/components/chat/chat.viewmodel';
import { Chat, Message } from 'src/app/shared/generated';
import { chatAssistantFeature } from '../../chat.reducers';
import { initialState } from './chat-assistant.reducers';
import { ChatAssistantViewModel } from './chat-assistant.viewmodel';

const baseSelectors = createChildSelectors(
  chatAssistantFeature.selectChatAssistantState,
  initialState
);

export const selectChatList = createSelector(
  chatAssistantFeature.selectChatAssistantState,
  (state) => state.chatList
);

export const selectChats = createSelector(
  selectChatList,
  (chatList) => chatList.chats
);

export const selectSelectedChatMode = createSelector(
  selectChatList,
  (chatList) => chatList.selectedChatMode
);

export const selectChat = createSelector(
  chatAssistantFeature.selectChatAssistantState,
  (state) => state.chat
);

export const selectChatId = createSelector(
  selectChat,
  (chat) => chat.chatId
);

export const selectMessages = createSelector(
  selectChat,
  (chat) => chat.messages
);

export const selectChatSettings = createSelector(
  selectChat,
  (chat) => chat.settings
);

export const selectShared = createSelector(
  chatAssistantFeature.selectChatAssistantState,
  (state) => state.shared
);

export const selectCurrentUser = createSelector(
  selectShared,
  (shared) => shared.currentUser
);

const selectCurrentChatFromState = createSelector(
  selectChatId,
  selectChats,
  (chatId, chats) => chats.find((c) => c.id === chatId)
);

const selectUserFromState = selectCurrentUser;

const selectTopicFromState = createSelector(
  selectChatSettings,
  (settings) => settings?.chatName ?? 'chat-assistant'
);

export const chatAssistantSelectors = {
  ...baseSelectors,
  selectCurrentChat: selectCurrentChatFromState,
  selectCurrentMessages: selectMessages,
  selectUser: selectUserFromState,
  selectTopic: selectTopicFromState,
  selectChat,
  selectChatList,
  selectShared,
  selectChats,
  selectChatId,
  selectMessages,
  selectChatSettings,
  selectCurrentUser,
  selectSelectedChatMode,
};

export const selectChatAssistantViewModel = createSelector(
  selectChats,
  selectCurrentChatFromState,
  selectMessages,
  selectSelectedChatMode,
  (
    chats: Chat[],
    currentChat: Chat | undefined,
    currentMessages: Message[],
    selectedChatMode: string | null
  ): ChatAssistantViewModel => {
    let chatTitleKey = 'CHAT.TITLE.DEFAULT';
    switch (selectedChatMode) {
      case 'ai':
        chatTitleKey = 'CHAT.TITLE.AI';
        break;
      case 'direct':
        chatTitleKey = 'CHAT.TITLE.DIRECT';
        break;
      case 'group':
        chatTitleKey = 'CHAT.TITLE.GROUP';
        break;
    }
    return {
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
      chatTitleKey,
      selectedChatMode,
    };
  }
);
