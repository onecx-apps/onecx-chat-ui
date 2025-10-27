import { createSelector } from '@ngrx/store';
import { chatFeature } from '../../chat.reducers';
import { ChatAssistantViewModel } from './chat-assistant.viewmodel';
import { ChatMessage } from 'src/app/shared/components/chat/chat.viewmodel';

export const chatAssistantSelectors = {};

export const selectChatAssistantViewModel = createSelector(
  chatFeature.selectAssistant,
  (state): ChatAssistantViewModel => {
    let chatTitleKey = 'CHAT.TITLE.DEFAULT';
    switch (state.selectedChatMode) {
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
      ...state,
      currentMessages: state.currentMessages?.map(
        (m) =>
          ({
            ...m,
            id: m.id ?? '',
            text: m.text ?? '',
            userName: m.userName ?? '',
            userNameKey: `CHAT.PARTICIPANT.${m.type.toUpperCase()}`,
            creationDate: new Date(m.creationDate ?? ''),
          } as ChatMessage)
      ),
      chatTitleKey,
    };
  }
);
