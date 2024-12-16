import { ChatType } from 'src/app/shared/generated';
import * as fromSelectors from './chat-assistant.selectors';
import { ChatAssistantViewModel } from './chat-assistant.viewmodel';
import { NEW_AI_CHAT_ITEM } from 'src/app/shared/components/chat-list/chat-list.component';

describe('ChatAssistant Selectors', () => {
  const initialState = {
    chats: [
      { id: '1', message: 'Hello', type: ChatType.AiChat },
      { id: '2', message: 'Hi', type: ChatType.AiChat },
    ],
  };

  describe('selectChatAssistantViewModel', () => {
    it('should select the chat assistant view model', () => {
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        initialState.chats,
        undefined,
        []
      );
      const expected: ChatAssistantViewModel = {
        chats: [NEW_AI_CHAT_ITEM, ...initialState.chats],
        currentChat: NEW_AI_CHAT_ITEM,
        currentMessages: [],
      };
      expect(result).toEqual(expected);
    });
  });
});
