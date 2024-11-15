import { ChatType } from 'src/app/shared/generated';
import * as fromSelectors from './chat-assistant.selectors';
import { ChatAssistantViewModel } from './chat-assistant.viewmodel';

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
        initialState.chats
      );
      const expected: ChatAssistantViewModel = {
        chats: initialState.chats,
      };
      expect(result).toEqual(expected);
    });
  });
});
