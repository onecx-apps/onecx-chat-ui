import { MessageType, Chat, Message, ChatType } from 'src/app/shared/generated';
import { ChatAssistantActions } from './chat-assistant.actions';
import { chatAssistantReducer, initialState } from './chat-assistant.reducers';
import { ChatAssistantState } from './chat-assistant.state';

// Extended interface for testing purposes to include additional properties used in the reducer
interface ExtendedMessage extends Message {
  isLoadingInfo?: boolean;
  isFailed?: boolean;
}

describe('ChatAssistantReducer', () => {
  describe('initialState', () => {
    it('should have the correct initial state', () => {
      expect(initialState).toEqual({
        user: {
          userId: '123',
          userName: 'human',
          email: 'human@earth.io',
        },
        chats: [],
        currentChat: undefined,
        currentMessages: undefined,
        topic: 'chat-assistant',
        selectedChatMode: null,
      });
    });
  });

  describe('messageSentForNewChat action', () => {
    it('should set currentChat when messageSentForNewChat is dispatched', () => {
      const chat: Chat = {
        id: 'chat-1',
        type: ChatType.AiChat,
        topic: 'Test Chat',
        summary: 'Test Summary',
      };

      const action = ChatAssistantActions.messageSentForNewChat({
        chat,
        message: 'Hello',
      });

      const state = chatAssistantReducer(initialState, action);

      expect(state.currentChat).toEqual(chat);
      expect(state).toEqual({
        ...initialState,
        currentChat: chat,
      });
    });
  });

  describe('messageSent action', () => {
    it('should add human message and loading AI message to currentMessages', () => {
      const message = 'Hello, how are you?';
      const existingMessages: Message[] = [
        {
          id: 'msg-1',
          type: MessageType.Human,
          text: 'Previous message',
          creationDate: '2023-01-01T00:00:00Z',
        },
      ];

      const currentState: ChatAssistantState = {
        ...initialState,
        currentMessages: existingMessages,
      };

      const action = ChatAssistantActions.messageSent({ message });
      const state = chatAssistantReducer(currentState, action);

      expect(state.currentMessages).toHaveLength(3);
      expect(state.currentMessages![0]).toEqual({
        type: MessageType.Human,
        id: 'new',
        text: message,
        creationDate: expect.any(String),
      });
      expect(state.currentMessages![1]).toEqual({
        creationDate: expect.any(String),
        id: 'ai-temp',
        type: MessageType.Assistant,
        text: '',
        isLoadingInfo: true,
      } as ExtendedMessage);
      expect(state.currentMessages![2]).toEqual(existingMessages[0]);
    });

    it('should filter out temp messages when adding new messages', () => {
      const message = 'Hello';
      const existingMessages: Message[] = [
        {
          id: 'temp-123',
          type: MessageType.Human,
          text: 'Temp message',
          creationDate: '2023-01-01T00:00:00Z',
        },
        {
          id: 'new',
          type: MessageType.Human,
          text: 'New message',
          creationDate: '2023-01-01T00:00:00Z',
        },
        {
          id: 'msg-1',
          type: MessageType.Human,
          text: 'Real message',
          creationDate: '2023-01-01T00:00:00Z',
        },
      ];

      const currentState: ChatAssistantState = {
        ...initialState,
        currentMessages: existingMessages,
      };

      const action = ChatAssistantActions.messageSent({ message });
      const state = chatAssistantReducer(currentState, action);

      expect(state.currentMessages).toHaveLength(3);
      // Should only include the real message (not temp or new)
      expect(state.currentMessages![2].id).toBe('msg-1');
    });

    it('should handle empty currentMessages array', () => {
      const message = 'Hello';
      const action = ChatAssistantActions.messageSent({ message });
      const state = chatAssistantReducer(initialState, action);

      expect(state.currentMessages).toHaveLength(2);
      expect(state.currentMessages![0].type).toBe(MessageType.Human);
      expect(state.currentMessages![1].type).toBe(MessageType.Assistant);
    });
  });

  describe('messageSendingFailed action', () => {
    it('should add failed human message to currentMessages', () => {
      const message = 'Failed message';
      const existingMessages: Message[] = [
        {
          id: 'msg-1',
          type: MessageType.Human,
          text: 'Previous message',
          creationDate: '2023-01-01T00:00:00Z',
        },
      ];

      const currentState: ChatAssistantState = {
        ...initialState,
        currentMessages: existingMessages,
      };

      const action = ChatAssistantActions.messageSendingFailed({
        message,
        error: 'Network error',
      });

      const state = chatAssistantReducer(currentState, action);

      expect(state.currentMessages).toHaveLength(2);
      expect(state.currentMessages![0]).toEqual({
        type: MessageType.Human,
        id: 'new',
        text: message,
        creationDate: expect.any(String),
        isFailed: true,
      } as ExtendedMessage);
      expect(state.currentMessages![1]).toEqual(existingMessages[0]);
    });

    it('should filter out temp messages when message sending fails', () => {
      const message = 'Failed message';
      const existingMessages: Message[] = [
        {
          id: 'temp-123',
          type: MessageType.Human,
          text: 'Temp message',
          creationDate: '2023-01-01T00:00:00Z',
        },
        {
          id: 'msg-1',
          type: MessageType.Human,
          text: 'Real message',
          creationDate: '2023-01-01T00:00:00Z',
        },
      ];

      const currentState: ChatAssistantState = {
        ...initialState,
        currentMessages: existingMessages,
      };

      const action = ChatAssistantActions.messageSendingFailed({
        message,
        error: 'Network error',
      });

      const state = chatAssistantReducer(currentState, action);

      expect(state.currentMessages).toHaveLength(2);
      expect(state.currentMessages![1].id).toBe('msg-1');
    });
  });

  describe('chatsLoaded action', () => {
    it('should set chats array when chatsLoaded is dispatched', () => {
      const chats: Chat[] = [
        {
          id: 'chat-1',
          type: ChatType.AiChat,
          topic: 'Chat 1',
        },
        {
          id: 'chat-2',
          type: ChatType.HumanChat,
          topic: 'Chat 2',
        },
      ];

      const action = ChatAssistantActions.chatsLoaded({ chats });
      const state = chatAssistantReducer(initialState, action);

      expect(state.chats).toEqual(chats);
      expect(state).toEqual({
        ...initialState,
        chats,
      });
    });

    it('should replace existing chats', () => {
      const existingChats: Chat[] = [
        {
          id: 'old-chat',
          type: ChatType.AiChat,
          topic: 'Old Chat',
        },
      ];

      const currentState: ChatAssistantState = {
        ...initialState,
        chats: existingChats,
      };

      const newChats: Chat[] = [
        {
          id: 'new-chat-1',
          type: ChatType.AiChat,
          topic: 'New Chat 1',
        },
        {
          id: 'new-chat-2',
          type: ChatType.HumanChat,
          topic: 'New Chat 2',
        },
      ];

      const action = ChatAssistantActions.chatsLoaded({ chats: newChats });
      const state = chatAssistantReducer(currentState, action);

      expect(state.chats).toEqual(newChats);
      expect(state.chats).not.toContain(existingChats[0]);
    });
  });

  describe('messagesLoaded action', () => {
    it('should set currentMessages when messagesLoaded is dispatched', () => {
      const messages: Message[] = [
        {
          id: 'msg-1',
          type: MessageType.Human,
          text: 'Hello',
          creationDate: '2023-01-01T00:00:00Z',
        },
        {
          id: 'msg-2',
          type: MessageType.Assistant,
          text: 'Hi there!',
          creationDate: '2023-01-01T00:01:00Z',
        },
      ];

      const action = ChatAssistantActions.messagesLoaded({ messages });
      const state = chatAssistantReducer(initialState, action);

      expect(state.currentMessages).toEqual(messages);
    });

    it('should replace existing messages', () => {
      const existingMessages: Message[] = [
        {
          id: 'old-msg',
          type: MessageType.Human,
          text: 'Old message',
          creationDate: '2023-01-01T00:00:00Z',
        },
      ];

      const currentState: ChatAssistantState = {
        ...initialState,
        currentMessages: existingMessages,
      };

      const newMessages: Message[] = [
        {
          id: 'new-msg-1',
          type: MessageType.Human,
          text: 'New message 1',
          creationDate: '2023-01-02T00:00:00Z',
        },
        {
          id: 'new-msg-2',
          type: MessageType.Assistant,
          text: 'New message 2',
          creationDate: '2023-01-02T00:01:00Z',
        },
      ];

      const action = ChatAssistantActions.messagesLoaded({ messages: newMessages });
      const state = chatAssistantReducer(currentState, action);

      expect(state.currentMessages).toEqual(newMessages);
      expect(state.currentMessages).not.toContain(existingMessages[0]);
    });
  });

  describe('chatSelected and chatCreationSuccessful actions', () => {
    const chat: Chat = {
      id: 'selected-chat',
      type: ChatType.AiChat,
      topic: 'Selected Chat',
    };

    it('should set currentChat and reset currentMessages when chatSelected is dispatched', () => {
      const existingMessages: Message[] = [
        {
          id: 'msg-1',
          type: MessageType.Human,
          text: 'Existing message',
          creationDate: '2023-01-01T00:00:00Z',
        },
      ];

      const currentState: ChatAssistantState = {
        ...initialState,
        currentMessages: existingMessages,
      };

      const action = ChatAssistantActions.chatSelected({ chat });
      const state = chatAssistantReducer(currentState, action);

      expect(state.currentChat).toEqual(chat);
      expect(state.currentMessages).toEqual([]);
    });

    it('should set currentChat and reset currentMessages when chatCreationSuccessful is dispatched', () => {
      const existingMessages: Message[] = [
        {
          id: 'msg-1',
          type: MessageType.Human,
          text: 'Existing message',
          creationDate: '2023-01-01T00:00:00Z',
        },
      ];

      const currentState: ChatAssistantState = {
        ...initialState,
        currentMessages: existingMessages,
      };

      const action = ChatAssistantActions.chatCreationSuccessful({ chat });
      const state = chatAssistantReducer(currentState, action);

      expect(state.currentChat).toEqual(chat);
      expect(state.currentMessages).toEqual([]);
    });
  });

  describe('chatDeletionSuccessful action', () => {
    it('should remove chat from chats array and reset current state', () => {
      const chatToDelete: Chat = {
        id: 'chat-to-delete',
        type: ChatType.AiChat,
        topic: 'Chat to delete',
      };

      const remainingChat: Chat = {
        id: 'remaining-chat',
        type: ChatType.HumanChat,
        topic: 'Remaining chat',
      };

      const currentState: ChatAssistantState = {
        ...initialState,
        chats: [chatToDelete, remainingChat],
        currentChat: chatToDelete,
        currentMessages: [
          {
            id: 'msg-1',
            type: MessageType.Human,
            text: 'Message in deleted chat',
            creationDate: '2023-01-01T00:00:00Z',
          },
        ],
      };

      const action = ChatAssistantActions.chatDeletionSuccessful({
        chatId: 'chat-to-delete',
      });

      const state = chatAssistantReducer(currentState, action);

      expect(state.chats).toHaveLength(1);
      expect(state.chats[0]).toEqual(remainingChat);
      expect(state.currentChat).toBeUndefined();
      expect(state.currentMessages).toEqual([]);
    });

    it('should handle deletion of non-current chat', () => {
      const chatToDelete: Chat = {
        id: 'chat-to-delete',
        type: ChatType.AiChat,
        topic: 'Chat to delete',
      };

      const currentChat: Chat = {
        id: 'current-chat',
        type: ChatType.HumanChat,
        topic: 'Current chat',
      };

      const currentState: ChatAssistantState = {
        ...initialState,
        chats: [chatToDelete, currentChat],
        currentChat: currentChat,
        currentMessages: [
          {
            id: 'msg-1',
            type: MessageType.Human,
            text: 'Message in current chat',
            creationDate: '2023-01-01T00:00:00Z',
          },
        ],
      };

      const action = ChatAssistantActions.chatDeletionSuccessful({
        chatId: 'chat-to-delete',
      });

      const state = chatAssistantReducer(currentState, action);

      expect(state.chats).toHaveLength(1);
      expect(state.chats[0]).toEqual(currentChat);
      expect(state.currentChat).toBeUndefined();
      expect(state.currentMessages).toEqual([]);
    });
  });

  describe('chatModeSelected action', () => {
    it('should set selectedChatMode when chatModeSelected is dispatched', () => {
      const mode = 'group-chat';
      const action = ChatAssistantActions.chatModeSelected({ mode });
      const state = chatAssistantReducer(initialState, action);

      expect(state.selectedChatMode).toBe(mode);
      expect(state).toEqual({
        ...initialState,
        selectedChatMode: mode,
      });
    });

    it('should replace existing selectedChatMode', () => {
      const currentState: ChatAssistantState = {
        ...initialState,
        selectedChatMode: 'old-mode',
      };

      const newMode = 'new-mode';
      const action = ChatAssistantActions.chatModeSelected({ mode: newMode });
      const state = chatAssistantReducer(currentState, action);

      expect(state.selectedChatMode).toBe(newMode);
    });
  });

  describe('chatModeDeselected action', () => {
    it('should set selectedChatMode to null when chatModeDeselected is dispatched', () => {
      const currentState: ChatAssistantState = {
        ...initialState,
        selectedChatMode: 'some-mode',
      };

      const action = ChatAssistantActions.chatModeDeselected();
      const state = chatAssistantReducer(currentState, action);

      expect(state.selectedChatMode).toBeNull();
    });

    it('should handle deselection when no mode is selected', () => {
      const action = ChatAssistantActions.chatModeDeselected();
      const state = chatAssistantReducer(initialState, action);

      expect(state.selectedChatMode).toBeNull();
    });
  });

  describe('cleanTemp function behavior', () => {
    it('should properly filter temp and new messages', () => {
      const messages: Message[] = [
        {
          id: 'temp-123',
          type: MessageType.Human,
          text: 'Temp message',
          creationDate: '2023-01-01T00:00:00Z',
        },
        {
          id: 'new',
          type: MessageType.Human,
          text: 'New message',
          creationDate: '2023-01-01T00:00:00Z',
        },
        {
          id: 'ai-temp',
          type: MessageType.Assistant,
          text: 'AI temp message',
          creationDate: '2023-01-01T00:00:00Z',
        },
        {
          id: 'msg-1',
          type: MessageType.Human,
          text: 'Real message',
          creationDate: '2023-01-01T00:00:00Z',
        },
      ];

      const currentState: ChatAssistantState = {
        ...initialState,
        currentMessages: messages,
      };

      const action = ChatAssistantActions.messageSent({ message: 'Test' });
      const state = chatAssistantReducer(currentState, action);

      // Should have: new human message, new AI loading message, and the real message
      expect(state.currentMessages).toHaveLength(3);
      expect(state.currentMessages![2].id).toBe('msg-1');
    });
  });

  describe('edge cases', () => {
    it('should handle undefined currentMessages in messageSent', () => {
      const currentState: ChatAssistantState = {
        ...initialState,
        currentMessages: undefined,
      };

      const action = ChatAssistantActions.messageSent({ message: 'Test' });
      const state = chatAssistantReducer(currentState, action);

      expect(state.currentMessages).toHaveLength(2);
      expect(state.currentMessages![0].type).toBe(MessageType.Human);
      expect(state.currentMessages![1].type).toBe(MessageType.Assistant);
    });

    it('should handle undefined currentMessages in messageSendingFailed', () => {
      const currentState: ChatAssistantState = {
        ...initialState,
        currentMessages: undefined,
      };

      const action = ChatAssistantActions.messageSendingFailed({
        message: 'Test',
        error: 'Error',
      });

      const state = chatAssistantReducer(currentState, action);

      expect(state.currentMessages).toHaveLength(1);
      expect(state.currentMessages![0].type).toBe(MessageType.Human);
      expect((state.currentMessages![0] as ExtendedMessage).isFailed).toBe(true);
    });

    it('should handle empty chats array in chatDeletionSuccessful', () => {
      const currentState: ChatAssistantState = {
        ...initialState,
        chats: [],
      };

      const action = ChatAssistantActions.chatDeletionSuccessful({
        chatId: 'non-existent-chat',
      });

      const state = chatAssistantReducer(currentState, action);

      expect(state.chats).toEqual([]);
      expect(state.currentChat).toBeUndefined();
      expect(state.currentMessages).toEqual([]);
    });
  });
});