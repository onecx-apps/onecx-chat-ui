import { ChatType, MessageType } from 'src/app/shared/generated';
import * as fromSelectors from './chat-assistant.selectors';
import { ChatAssistantViewModel } from './chat-assistant.viewmodel';
import { NEW_AI_CHAT_ITEM } from 'src/app/shared/components/chat-list/chat-list.component';
import { ChatMessage } from 'src/app/shared/components/chat/chat.viewmodel';
import { ChatAssistantState } from './chat-assistant.state';

describe('ChatAssistant Selectors', () => {
  const mockChats = [
    { id: '1', topic: 'Test Chat 1', type: ChatType.AiChat },
    { id: '2', topic: 'Test Chat 2', type: ChatType.HumanChat },
  ];

  const mockMessages = [
    {
      id: 'msg1',
      text: 'Hello AI',
      userName: 'User1',
      type: MessageType.Human,
      creationDate: '2023-01-01T10:00:00Z'
    },
    {
      id: 'msg2',
      text: 'Hello Human',
      userName: 'AI Assistant',
      type: MessageType.Assistant,
      creationDate: '2023-01-01T10:01:00Z'
    }
  ];

  const mockCurrentChat = {
    id: 'current-chat',
    topic: 'Current Chat',
    type: ChatType.AiChat
  };

  const baseMockState: ChatAssistantState = {
    user: undefined,
    chats: [],
    currentChat: undefined,
    currentMessages: undefined,
    topic: '',
    selectedChatMode: 'ai'
  };

  describe('chatAssistantSelectors', () => {
    it('should exist and be defined', () => {
      expect(fromSelectors.chatAssistantSelectors).toBeDefined();
    });

    it('should have child selectors created from chatFeature', () => {
      expect(fromSelectors.chatAssistantSelectors.selectChats).toBeDefined();
      expect(fromSelectors.chatAssistantSelectors.selectCurrentChat).toBeDefined();
      expect(fromSelectors.chatAssistantSelectors.selectCurrentMessages).toBeDefined();
    });
  });

  describe('selectChatAssistantViewModel', () => {
    it('should select the chat assistant view model with AI chat mode', () => {
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        mockMessages,
        baseMockState
      );

      const expected: ChatAssistantViewModel = {
        chats: [NEW_AI_CHAT_ITEM, ...mockChats],
        currentChat: mockCurrentChat,
        currentMessages: [
          {
            id: 'msg1',
            text: 'Hello AI',
            userName: 'User1',
            userNameKey: 'CHAT.PARTICIPANT.HUMAN',
            creationDate: new Date('2023-01-01T10:00:00Z'),
            type: MessageType.Human
          },
          {
            id: 'msg2',
            text: 'Hello Human',
            userName: 'AI Assistant',
            userNameKey: 'CHAT.PARTICIPANT.ASSISTANT',
            creationDate: new Date('2023-01-01T10:01:00Z'),
            type: MessageType.Assistant
          }
        ] as ChatMessage[],
        chatTitleKey: 'CHAT.TITLE.AI',
      };

      expect(result).toEqual(expected);
    });

    it('should select the chat assistant view model with direct chat mode', () => {
      const mockState = {
        ...baseMockState,
        selectedChatMode: 'direct'
      };

      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        mockMessages,
        mockState
      );

      expect(result.chatTitleKey).toBe('CHAT.TITLE.DIRECT');
    });

    it('should select the chat assistant view model with group chat mode', () => {
      const mockState = {
        ...baseMockState,
        selectedChatMode: 'group'
      };

      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        mockMessages,
        mockState
      );

      expect(result.chatTitleKey).toBe('CHAT.TITLE.GROUP');
    });

    it('should use default title key for unknown chat mode', () => {
      const mockState = {
        ...baseMockState,
        selectedChatMode: 'unknown'
      };

      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        mockMessages,
        mockState
      );

      expect(result.chatTitleKey).toBe('CHAT.TITLE.DEFAULT');
    });

    it('should handle undefined currentChat by using NEW_AI_CHAT_ITEM', () => {
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        undefined,
        mockMessages,
        baseMockState
      );

      expect(result.currentChat).toEqual(NEW_AI_CHAT_ITEM);
    });

    it('should handle undefined currentMessages', () => {
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        undefined,
        baseMockState
      );

      expect(result.currentMessages).toBeUndefined();
    });

    it('should handle empty currentMessages array', () => {
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        [],
        baseMockState
      );

      expect(result.currentMessages).toEqual([]);
    });

    it('should handle messages with missing optional fields', () => {
      const messagesWithMissingFields = [
        {
          type: MessageType.Human,
        },
        {
          id: 'msg2',
          text: 'Complete message',
          userName: 'User',
          type: MessageType.Assistant,
          creationDate: '2023-01-01T10:00:00Z'
        }
      ];

      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        messagesWithMissingFields,
        baseMockState
      );

      expect(result.currentMessages).toHaveLength(2);
      
      // Check first message (with missing fields)
      expect(result.currentMessages?.[0]).toEqual({
        id: '',
        text: '',
        userName: '',
        userNameKey: 'CHAT.PARTICIPANT.HUMAN',
        creationDate: expect.any(Date),
        type: MessageType.Human
      });
      
      // Check that the creation date is Invalid Date (NaN)
      expect(isNaN(result.currentMessages?.[0].creationDate.getTime() ?? 0)).toBe(true);
      
      // Check second message (complete)
      expect(result.currentMessages?.[1]).toEqual({
        id: 'msg2',
        text: 'Complete message',
        userName: 'User',
        userNameKey: 'CHAT.PARTICIPANT.ASSISTANT',
        creationDate: new Date('2023-01-01T10:00:00Z'),
        type: MessageType.Assistant
      });
    });

    it('should sort messages by creation date', () => {
      const unsortedMessages = [
        {
          id: 'msg3',
          text: 'Third message',
          userName: 'User',
          type: MessageType.Human,
          creationDate: '2023-01-01T10:02:00Z'
        },
        {
          id: 'msg1',
          text: 'First message',
          userName: 'User',
          type: MessageType.Human,
          creationDate: '2023-01-01T10:00:00Z'
        },
        {
          id: 'msg2',
          text: 'Second message',
          userName: 'AI',
          type: MessageType.Assistant,
          creationDate: '2023-01-01T10:01:00Z'
        }
      ];

      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        unsortedMessages,
        baseMockState
      );

      expect(result.currentMessages?.[0].id).toBe('msg1');
      expect(result.currentMessages?.[1].id).toBe('msg2');
      expect(result.currentMessages?.[2].id).toBe('msg3');
    });

    it('should always include NEW_AI_CHAT_ITEM at the beginning of chats array', () => {
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        mockMessages,
        baseMockState
      );

      expect(result.chats?.[0]).toEqual(NEW_AI_CHAT_ITEM);
      expect(result.chats?.slice(1)).toEqual(mockChats);
    });

    it('should handle null selectedChatMode', () => {
      const mockState = {
        ...baseMockState,
        selectedChatMode: null
      };

      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        mockMessages,
        mockState
      );

      expect(result.chatTitleKey).toBe('CHAT.TITLE.DEFAULT');
    });

    it('should transform message type to uppercase for userNameKey', () => {
      const messageWithLowercaseType = [{
        id: 'test',
        text: 'test message',
        userName: 'testUser',
        type: MessageType.Human,
        creationDate: '2023-01-01T10:00:00Z'
      }];

      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        messageWithLowercaseType,
        baseMockState
      );

      expect(result.currentMessages?.[0].userNameKey).toBe('CHAT.PARTICIPANT.HUMAN');
    });
  });
});
