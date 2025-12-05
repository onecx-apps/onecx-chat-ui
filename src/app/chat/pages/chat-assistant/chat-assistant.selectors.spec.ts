import { ChatType, MessageType } from 'src/app/shared/generated';
import * as fromSelectors from './chat-assistant.selectors';
import { ChatAssistantViewModel } from './chat-assistant.viewmodel';
import { NEW_AI_CHAT_ITEM } from 'src/app/shared/components/chat-list/chat-list.component';
import { ChatAssistantState } from './chat-assistant.state';

describe('ChatAssistant Selectors', () => {
  const initialState = {
    chats: [
      { id: '1', topic: 'Chat 1', type: ChatType.AiChat },
      { id: '2', topic: 'Chat 2', type: ChatType.AiChat },
    ],
  };

  const createMockState = (overrides?: Partial<ChatAssistantState>): ChatAssistantState => ({
    user: undefined,
    chats: [],
    currentChat: undefined,
    currentMessages: undefined,
    topic: '',
    sidebarVisible: false,
    selectedChatMode: null,
    ...overrides
  });

  describe('selectChatAssistantViewModel', () => {
    it('should select the chat assistant view model with ai mode', () => {
      const mockState = createMockState({ selectedChatMode: 'ai' });
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        initialState.chats,
        undefined,
        [],
        mockState
      );
      const expected: ChatAssistantViewModel = {
        chats: [NEW_AI_CHAT_ITEM, ...initialState.chats],
        currentChat: NEW_AI_CHAT_ITEM,
        currentMessages: [],
        chatTitleKey: 'CHAT.TITLE.AI',
        sidebarVisible: false,
        selectedChatMode: 'ai',
      };
      expect(result).toEqual(expected);
    });

    it('should select the chat assistant view model with direct mode', () => {
      const mockState = createMockState({ selectedChatMode: 'direct' });
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        initialState.chats,
        undefined,
        [],
        mockState
      );
      const expected: ChatAssistantViewModel = {
        chats: [NEW_AI_CHAT_ITEM, ...initialState.chats],
        currentChat: NEW_AI_CHAT_ITEM,
        currentMessages: [],
        chatTitleKey: 'CHAT.TITLE.DIRECT',
        sidebarVisible: false,
        selectedChatMode: 'direct',
      };
      expect(result).toEqual(expected);
    });

    it('should select the chat assistant view model with group mode', () => {
      const mockState = createMockState({ selectedChatMode: 'group' });
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        initialState.chats,
        undefined,
        [],
        mockState
      );
      const expected: ChatAssistantViewModel = {
        chats: [NEW_AI_CHAT_ITEM, ...initialState.chats],
        currentChat: NEW_AI_CHAT_ITEM,
        currentMessages: [],
        chatTitleKey: 'CHAT.TITLE.GROUP',
        sidebarVisible: false,
        selectedChatMode: 'group',
      };
      expect(result).toEqual(expected);
    });

    it('should use default title when selectedChatMode is null', () => {
      const mockState = createMockState({ selectedChatMode: null });
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        initialState.chats,
        undefined,
        [],
        mockState
      );
      expect(result.chatTitleKey).toBe('CHAT.TITLE.DEFAULT');
      expect(result.sidebarVisible).toBe(false);
      expect(result.selectedChatMode).toBeNull();
    });

    it('should use default title when selectedChatMode is unknown', () => {
      const mockState = createMockState({ selectedChatMode: 'unknown-mode' });
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        initialState.chats,
        undefined,
        [],
        mockState
      );
      expect(result.chatTitleKey).toBe('CHAT.TITLE.DEFAULT');
      expect(result.selectedChatMode).toBe('unknown-mode');
    });

    it('should return current chat when provided', () => {
      const currentChat = { id: 'current', topic: 'Current Chat', type: ChatType.AiChat };
      const mockState = createMockState({ selectedChatMode: 'ai' });
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        initialState.chats,
        currentChat,
        [],
        mockState
      );
      expect(result.currentChat).toEqual(currentChat);
    });

    it('should map and sort current messages correctly', () => {
      const mockMessages = [
        {
          id: '2',
          type: MessageType.Assistant,
          text: 'Hello!',
          userName: 'AI',
          creationDate: '2023-01-02T00:00:00Z',
        },
        {
          id: '1',
          type: MessageType.Human,
          text: 'Hi',
          userName: 'User',
          creationDate: '2023-01-01T00:00:00Z',
        },
        {
          id: '3',
          type: MessageType.Human,
          text: 'How are you?',
          userName: 'User',
          creationDate: '2023-01-03T00:00:00Z',
        },
      ];

      const mockState = createMockState({ selectedChatMode: 'ai' });

      const result = fromSelectors.selectChatAssistantViewModel.projector(
        [],
        undefined,
        mockMessages,
        mockState
      );

      expect(result.currentMessages).toHaveLength(3);
      
      // Check if messages are sorted by creation date (ascending)
      expect(result.currentMessages![0].id).toBe('1');
      expect(result.currentMessages![1].id).toBe('2');
      expect(result.currentMessages![2].id).toBe('3');

      // Check if messages are mapped correctly
      expect(result.currentMessages![0]).toEqual({
        id: '1',
        type: MessageType.Human,
        text: 'Hi',
        userName: 'User',
        userNameKey: 'CHAT.PARTICIPANT.HUMAN',
        creationDate: new Date('2023-01-01T00:00:00Z'),
      });

      expect(result.currentMessages![1]).toEqual({
        id: '2',
        type: MessageType.Assistant,
        text: 'Hello!',
        userName: 'AI',
        userNameKey: 'CHAT.PARTICIPANT.ASSISTANT',
        creationDate: new Date('2023-01-02T00:00:00Z'),
      });
    });

    it('should handle messages with missing properties', () => {
      const mockMessages = [
        {
          type: MessageType.Human,
          creationDate: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          type: MessageType.Assistant,
          text: 'Hello!',
        },
      ];

      const mockState = createMockState({ selectedChatMode: 'ai' });

      const result = fromSelectors.selectChatAssistantViewModel.projector(
        [],
        undefined,
        mockMessages,
        mockState
      );

      expect(result.currentMessages).toHaveLength(2);
      
      expect(result.currentMessages![0]).toEqual({
        id: '',
        type: MessageType.Human,
        text: '',
        userName: '',
        userNameKey: 'CHAT.PARTICIPANT.HUMAN',
        creationDate: new Date('2023-01-01T00:00:00Z'),
      });

      expect(result.currentMessages![1].id).toBe('2');
      expect(result.currentMessages![1].type).toBe(MessageType.Assistant);
      expect(result.currentMessages![1].text).toBe('Hello!');
      expect(result.currentMessages![1].userName).toBe('');
      expect(result.currentMessages![1].userNameKey).toBe('CHAT.PARTICIPANT.ASSISTANT');
      expect(isNaN(result.currentMessages![1].creationDate.getTime())).toBe(true);
    });

    it('should handle undefined currentMessages', () => {
      const mockState = createMockState({ selectedChatMode: 'ai' });

      const result = fromSelectors.selectChatAssistantViewModel.projector(
        initialState.chats,
        undefined,
        undefined,
        mockState
      );

      expect(result.currentMessages).toBeUndefined();
    });

    it('should handle empty currentMessages array', () => {
      const mockState = createMockState({ selectedChatMode: 'ai' });

      const result = fromSelectors.selectChatAssistantViewModel.projector(
        initialState.chats,
        undefined,
        [],
        mockState
      );

      expect(result.currentMessages).toEqual([]);
    });

    it('should correctly generate userNameKey for different message types', () => {
      const mockMessages = [
        {
          id: '1',
          type: MessageType.Human,
          text: 'Human message',
          creationDate: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          type: MessageType.Assistant,
          text: 'Assistant message',
          creationDate: '2023-01-01T00:01:00Z',
        },
        {
          id: '3',
          type: MessageType.System,
          text: 'System message',
          creationDate: '2023-01-01T00:02:00Z',
        },
      ];

      const mockState = createMockState({ selectedChatMode: 'ai' });

      const result = fromSelectors.selectChatAssistantViewModel.projector(
        [],
        undefined,
        mockMessages,
        mockState
      );

      expect(result.currentMessages![0].userNameKey).toBe('CHAT.PARTICIPANT.HUMAN');
      expect(result.currentMessages![1].userNameKey).toBe('CHAT.PARTICIPANT.ASSISTANT');
      expect(result.currentMessages![2].userNameKey).toBe('CHAT.PARTICIPANT.SYSTEM');
    });

    it('should maintain message order when dates are the same', () => {
      const sameDate = '2023-01-01T00:00:00Z';
      const mockMessages = [
        {
          id: 'second',
          type: MessageType.Human,
          text: 'Second',
          creationDate: sameDate,
        },
        {
          id: 'first',
          type: MessageType.Human,
          text: 'First',
          creationDate: sameDate,
        },
      ];

      const mockState = createMockState({ selectedChatMode: 'ai' });

      const result = fromSelectors.selectChatAssistantViewModel.projector(
        [],
        undefined,
        mockMessages,
        mockState
      );

      expect(result.currentMessages).toHaveLength(2);
      expect(result.currentMessages![0].id).toBe('second');
      expect(result.currentMessages![1].id).toBe('first');
    });

    it('should use default values for undefined/null state properties', () => {
      const mockState = createMockState({ 
        sidebarVisible: undefined, 
        selectedChatMode: undefined 
      });

      const result = fromSelectors.selectChatAssistantViewModel.projector(
        [],
        undefined,
        [],
        mockState
      );

      expect(result.sidebarVisible).toBe(false);
      expect(result.selectedChatMode).toBeNull();
    });
  });
});
