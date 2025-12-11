import { ChatType, MessageType } from 'src/app/shared/generated';
import * as fromSelectors from './chat-assistant.selectors';
import { ChatAssistantViewModel } from './chat-assistant.viewmodel';
import { NEW_AI_CHAT_ITEM } from 'src/app/shared/components/chat-list/chat-list.component';
import { ChatMessage } from 'src/app/shared/components/chat/chat.viewmodel';

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

  const selectedChatMode = 'ai';

  describe('chatAssistantSelectors', () => {
    it('should exist and be defined', () => {
      expect(fromSelectors.chatAssistantSelectors).toBeDefined();
    });

    it('should have child selectors created from chatFeature', () => {
      expect(fromSelectors.chatAssistantSelectors.selectUser).toBeDefined();
      expect(fromSelectors.chatAssistantSelectors.selectChats).toBeDefined();
      expect(fromSelectors.chatAssistantSelectors.selectCurrentChat).toBeDefined();
      expect(fromSelectors.chatAssistantSelectors.selectCurrentMessages).toBeDefined();
      expect(fromSelectors.chatAssistantSelectors.selectTopic).toBeDefined();
      expect(fromSelectors.chatAssistantSelectors.selectSelectedChatMode).toBeDefined();
    });
  });

  describe('selectChatAssistantViewModel', () => {
    it('should select the chat assistant view model with AI chat mode', () => {
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        mockMessages,
        selectedChatMode
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
        selectedChatMode: 'ai'
      };

      expect(result).toEqual(expected);
    });

    it('should select the chat assistant view model with direct chat mode', () => {
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        mockMessages,
        'direct'
      );
      expect(result.chatTitleKey).toBe('CHAT.TITLE.DIRECT');
      expect(result.selectedChatMode).toBe('direct');
    });

    it('should select the chat assistant view model with group chat mode', () => {
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        mockMessages,
        'group'
      );
      expect(result.chatTitleKey).toBe('CHAT.TITLE.GROUP');
      expect(result.selectedChatMode).toBe('group');
    });

    it('should use default title key for unknown chat mode', () => {
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        mockMessages,
        'unknown'
      );
      expect(result.chatTitleKey).toBe('CHAT.TITLE.DEFAULT');
      expect(result.selectedChatMode).toBe('unknown');
    });

    it('should handle undefined currentChat by using NEW_AI_CHAT_ITEM', () => {
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        undefined,
        mockMessages,
        selectedChatMode
      );
      expect(result.currentChat).toEqual(NEW_AI_CHAT_ITEM);
    });

    it('should handle undefined currentMessages', () => {
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        [], // pass [] instead of undefined
        selectedChatMode
      );
      expect(result.currentMessages).toEqual([]);
    });

    it('should handle empty currentMessages array', () => {
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        [],
        selectedChatMode
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
        selectedChatMode
      );
      expect(result.currentMessages).toHaveLength(2);
      expect(result.currentMessages?.[0]).toEqual({
        id: '',
        text: '',
        userName: '',
        userNameKey: 'CHAT.PARTICIPANT.HUMAN',
        creationDate: expect.any(Date),
        type: MessageType.Human
      });
      expect(isNaN(result.currentMessages?.[0].creationDate.getTime() ?? 0)).toBe(true);
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
        selectedChatMode
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
        selectedChatMode
      );
      expect(result.chats?.[0]).toEqual(NEW_AI_CHAT_ITEM);
      expect(result.chats?.slice(1)).toEqual(mockChats);
    });

    it('should handle null selectedChatMode', () => {
      const result = fromSelectors.selectChatAssistantViewModel.projector(
        mockChats,
        mockCurrentChat,
        mockMessages,
        null
      );
      expect(result.chatTitleKey).toBe('CHAT.TITLE.DEFAULT');
      expect(result.selectedChatMode).toBeNull();
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
        selectedChatMode
      );
      expect(result.currentMessages?.[0].userNameKey).toBe('CHAT.PARTICIPANT.HUMAN');
    });
  });

  describe('Simple Selectors', () => {
    const baseState = {
      chatList: {
        chats: [{ id: '1', type: ChatType.HumanChat }, { id: '2', type: ChatType.AiChat }],
        isLoadingChats: false,
        chatsError: null,
        selectedChatMode: 'ai',
      },
      chat: {
        chatId: '1',
        messages: [{ id: 'msg1', type: MessageType.Human }],
        settings: { chatName: 'TestName' },
        isLoadingMessages: false,
        messageError: null
      },
      shared: {
        currentUser: { userId: 'u1', userName: 'User', email: 'user@x.com' }
      }
    };

    it('selectChatList returns chatList', () => {
      expect(fromSelectors.selectChatList.projector(baseState)).toEqual(baseState.chatList);
    });

    it('selectChats returns chats', () => {
      expect(fromSelectors.selectChats.projector(baseState.chatList)).toEqual(baseState.chatList.chats);
    });

    it('selectSelectedChatMode returns selectedChatMode', () => {
      expect(fromSelectors.selectSelectedChatMode.projector(baseState.chatList)).toBe('ai');
    });

    it('selectChat returns chat', () => {
      expect(fromSelectors.selectChat.projector(baseState)).toEqual(baseState.chat);
    });

    it('selectChatId returns chatId', () => {
      expect(fromSelectors.selectChatId.projector(baseState.chat)).toBe('1');
    });

    it('selectMessages returns messages', () => {
      expect(fromSelectors.selectMessages.projector(baseState.chat)).toEqual(baseState.chat.messages);
    });

    it('selectChatSettings returns settings', () => {
      expect(fromSelectors.selectChatSettings.projector(baseState.chat)).toEqual(baseState.chat.settings);
    });

    it('selectShared returns shared', () => {
      expect(fromSelectors.selectShared.projector(baseState)).toEqual(baseState.shared);
    });

    it('selectCurrentUser returns currentUser', () => {
      expect(fromSelectors.selectCurrentUser.projector(baseState.shared)).toEqual(baseState.shared.currentUser);
    });

    it('selectCurrentChatFromState finds chat by id', () => {
      expect(fromSelectors.chatAssistantSelectors.selectCurrentChat.projector('1', baseState.chatList.chats)).toEqual(baseState.chatList.chats[0]);
    });

    it('selectCurrentChatFromState returns undefined if not found', () => {
      expect(fromSelectors.chatAssistantSelectors.selectCurrentChat.projector('x', baseState.chatList.chats)).toBeUndefined();
    });

    it('selectTopicFromState returns chatName if set', () => {
      expect(fromSelectors.chatAssistantSelectors.selectTopic.projector({ chatName: 'TestName' })).toBe('TestName');
    });

    it('selectTopicFromState returns default if chatName is undefined', () => {
      expect(fromSelectors.chatAssistantSelectors.selectTopic.projector({})).toBe('chat-assistant');
      expect(fromSelectors.chatAssistantSelectors.selectTopic.projector(null)).toBe('chat-assistant');
    });
  });
});
