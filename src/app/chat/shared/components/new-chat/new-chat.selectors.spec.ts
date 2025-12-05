import { selectDirectChat, selectDirectChatName, selectDirectRecipientInput } from './new-chat.selectors';
import { NewChatState, initialNewChatState } from './new-chat.state';

describe('New Chat Selectors', () => {
  describe('selectDirectChat', () => {
    it('should select direct chat state when state exists', () => {
      const mockState: NewChatState = {
        direct: {
          chatName: 'Test Chat',
          recipientInput: 'test@example.com'
        },
        group: {
          chatName: '',
          recipientInput: '',
          recipients: []
        },
        ai: {
          chatName: ''
        }
      };

      const result = selectDirectChat.projector(mockState);

      expect(result).toEqual({
        chatName: 'Test Chat',
        recipientInput: 'test@example.com'
      });
    });

    it('should return initial direct chat state when state is null', () => {
      const result = selectDirectChat.projector(null as any);

      expect(result).toEqual(initialNewChatState.direct);
    });

    it('should return initial direct chat state when state is undefined', () => {
      const result = selectDirectChat.projector(undefined as any);

      expect(result).toEqual(initialNewChatState.direct);
    });

    it('should return direct chat with empty values when not yet filled', () => {
      const mockState: NewChatState = {
        direct: {
          chatName: '',
          recipientInput: ''
        },
        group: {
          chatName: '',
          recipientInput: '',
          recipients: []
        },
        ai: {
          chatName: ''
        }
      };

      const result = selectDirectChat.projector(mockState);

      expect(result).toEqual({
        chatName: '',
        recipientInput: ''
      });
    });
  });

  describe('selectDirectChatName', () => {
    it('should select chat name from direct chat state', () => {
      const directChatState = {
        chatName: 'My Direct Chat',
        recipientInput: 'user@example.com'
      };

      const result = selectDirectChatName.projector(directChatState);

      expect(result).toBe('My Direct Chat');
    });

    it('should select empty string when chat name is empty', () => {
      const directChatState = {
        chatName: '',
        recipientInput: 'user@example.com'
      };

      const result = selectDirectChatName.projector(directChatState);

      expect(result).toBe('');
    });

    it('should handle chat name with special characters', () => {
      const directChatState = {
        chatName: 'Chat "with" \'quotes\' & symbols!',
        recipientInput: 'user@example.com'
      };

      const result = selectDirectChatName.projector(directChatState);

      expect(result).toBe('Chat "with" \'quotes\' & symbols!');
    });

    it('should handle long chat names', () => {
      const longName = 'A'.repeat(500);
      const directChatState = {
        chatName: longName,
        recipientInput: 'user@example.com'
      };

      const result = selectDirectChatName.projector(directChatState);

      expect(result).toBe(longName);
      expect(result.length).toBe(500);
    });
  });

  describe('selectDirectRecipientInput', () => {
    it('should select recipient input from direct chat state', () => {
      const directChatState = {
        chatName: 'Test Chat',
        recipientInput: 'john.doe@example.com'
      };

      const result = selectDirectRecipientInput.projector(directChatState);

      expect(result).toBe('john.doe@example.com');
    });

    it('should select empty string when recipient input is empty', () => {
      const directChatState = {
        chatName: 'Test Chat',
        recipientInput: ''
      };

      const result = selectDirectRecipientInput.projector(directChatState);

      expect(result).toBe('');
    });

    it('should handle recipient input with whitespace', () => {
      const directChatState = {
        chatName: 'Test Chat',
        recipientInput: '  user@example.com  '
      };

      const result = selectDirectRecipientInput.projector(directChatState);

      expect(result).toBe('  user@example.com  ');
    });

    it('should handle partial email input', () => {
      const directChatState = {
        chatName: 'Test Chat',
        recipientInput: 'john'
      };

      const result = selectDirectRecipientInput.projector(directChatState);

      expect(result).toBe('john');
    });

    it('should handle recipient input with name only', () => {
      const directChatState = {
        chatName: 'Test Chat',
        recipientInput: 'John Doe'
      };

      const result = selectDirectRecipientInput.projector(directChatState);

      expect(result).toBe('John Doe');
    });

    it('should handle special characters in recipient input', () => {
      const directChatState = {
        chatName: 'Test Chat',
        recipientInput: 'user+tag@example.co.uk'
      };

      const result = selectDirectRecipientInput.projector(directChatState);

      expect(result).toBe('user+tag@example.co.uk');
    });
  });

  describe('Selector Integration', () => {
    it('should work together to extract both chatName and recipientInput', () => {
      const mockState: NewChatState = {
        direct: {
          chatName: 'Integration Test Chat',
          recipientInput: 'integration@test.com'
        },
        group: {
          chatName: '',
          recipientInput: '',
          recipients: []
        },
        ai: {
          chatName: ''
        }
      };

      const directChat = selectDirectChat.projector(mockState);
      const chatName = selectDirectChatName.projector(directChat);
      const recipientInput = selectDirectRecipientInput.projector(directChat);

      expect(chatName).toBe('Integration Test Chat');
      expect(recipientInput).toBe('integration@test.com');
    });

    it('should handle completely empty state', () => {
      const mockState: NewChatState = initialNewChatState;

      const directChat = selectDirectChat.projector(mockState);
      const chatName = selectDirectChatName.projector(directChat);
      const recipientInput = selectDirectRecipientInput.projector(directChat);

      expect(chatName).toBe('');
      expect(recipientInput).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('should handle state with only chatName filled', () => {
      const mockState: NewChatState = {
        direct: {
          chatName: 'Only Name',
          recipientInput: ''
        },
        group: {
          chatName: '',
          recipientInput: '',
          recipients: []
        },
        ai: {
          chatName: ''
        }
      };

      const directChat = selectDirectChat.projector(mockState);
      const chatName = selectDirectChatName.projector(directChat);
      const recipientInput = selectDirectRecipientInput.projector(directChat);

      expect(chatName).toBe('Only Name');
      expect(recipientInput).toBe('');
    });

    it('should handle state with only recipientInput filled', () => {
      const mockState: NewChatState = {
        direct: {
          chatName: '',
          recipientInput: 'onlyrecipient@test.com'
        },
        group: {
          chatName: '',
          recipientInput: '',
          recipients: []
        },
        ai: {
          chatName: ''
        }
      };

      const directChat = selectDirectChat.projector(mockState);
      const chatName = selectDirectChatName.projector(directChat);
      const recipientInput = selectDirectRecipientInput.projector(directChat);

      expect(chatName).toBe('');
      expect(recipientInput).toBe('onlyrecipient@test.com');
    });

    it('should not be affected by group or ai state changes', () => {
      const mockState: NewChatState = {
        direct: {
          chatName: 'Direct Chat',
          recipientInput: 'direct@test.com'
        },
        group: {
          chatName: 'Group Chat',
          recipientInput: 'group@test.com',
          recipients: ['user1@test.com', 'user2@test.com']
        },
        ai: {
          chatName: 'AI Chat'
        }
      };

      const directChat = selectDirectChat.projector(mockState);
      const chatName = selectDirectChatName.projector(directChat);
      const recipientInput = selectDirectRecipientInput.projector(directChat);

      expect(chatName).toBe('Direct Chat');
      expect(recipientInput).toBe('direct@test.com');
      expect(chatName).not.toBe('Group Chat');
      expect(chatName).not.toBe('AI Chat');
    });
  });
});
