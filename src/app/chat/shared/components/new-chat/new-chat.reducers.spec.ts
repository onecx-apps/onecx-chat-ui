import { newChatReducer } from './new-chat.reducers';
import { NewChatState, initialNewChatState } from './new-chat.state';
import { NewChatActions } from './new-chat.actions';

describe('NewChat Reducers', () => {
  describe('Initial State', () => {
    it('should return the initial state', () => {
      const action = { type: 'Unknown' };
      const state = newChatReducer(undefined, action as any);

      expect(state).toEqual(initialNewChatState);
    });

    it('should have correct initial direct chat state', () => {
      const action = { type: 'Unknown' };
      const state = newChatReducer(undefined, action as any);

      expect(state.direct).toEqual({
        chatName: '',
        recipientInput: ''
      });
    });

    it('should have correct initial group chat state', () => {
      const action = { type: 'Unknown' };
      const state = newChatReducer(undefined, action as any);

      expect(state.group).toEqual({
        chatName: '',
        recipientInput: '',
        recipients: []
      });
    });

    it('should have correct initial AI chat state', () => {
      const action = { type: 'Unknown' };
      const state = newChatReducer(undefined, action as any);

      expect(state.ai).toEqual({
        chatName: ''
      });
    });
  });

  describe('directChatNameChanged', () => {
    it('should set direct chat name', () => {
      const action = NewChatActions.directChatNameChanged({ chatName: 'My Direct Chat' });
      const state = newChatReducer(initialNewChatState, action);

      expect(state.direct.chatName).toBe('My Direct Chat');
      expect(state.direct.recipientInput).toBe('');
    });

    it('should update direct chat name without affecting other properties', () => {
      const previousState: NewChatState = {
        ...initialNewChatState,
        direct: {
          chatName: 'Old Name',
          recipientInput: 'user@example.com'
        }
      };

      const action = NewChatActions.directChatNameChanged({ chatName: 'New Name' });
      const state = newChatReducer(previousState, action);

      expect(state.direct.chatName).toBe('New Name');
      expect(state.direct.recipientInput).toBe('user@example.com');
    });

    it('should not affect group or AI chat state', () => {
      const previousState: NewChatState = {
        direct: {
          chatName: 'Old Direct',
          recipientInput: ''
        },
        group: {
          chatName: 'Group Chat',
          recipientInput: '',
          recipients: ['user1@test.com']
        },
        ai: {
          chatName: 'AI Chat'
        }
      };

      const action = NewChatActions.directChatNameChanged({ chatName: 'New Direct' });
      const state = newChatReducer(previousState, action);

      expect(state.direct.chatName).toBe('New Direct');
      expect(state.group.chatName).toBe('Group Chat');
      expect(state.group.recipients).toEqual(['user1@test.com']);
      expect(state.ai.chatName).toBe('AI Chat');
    });

    it('should handle empty string', () => {
      const previousState: NewChatState = {
        ...initialNewChatState,
        direct: {
          chatName: 'Some Name',
          recipientInput: ''
        }
      };

      const action = NewChatActions.directChatNameChanged({ chatName: '' });
      const state = newChatReducer(previousState, action);

      expect(state.direct.chatName).toBe('');
    });

    it('should handle special characters in chat name', () => {
      const specialName = 'Chat "with" \'quotes\' & symbols! @#$%';
      const action = NewChatActions.directChatNameChanged({ chatName: specialName });
      const state = newChatReducer(initialNewChatState, action);

      expect(state.direct.chatName).toBe(specialName);
    });

    it('should handle very long chat names', () => {
      const longName = 'A'.repeat(1000);
      const action = NewChatActions.directChatNameChanged({ chatName: longName });
      const state = newChatReducer(initialNewChatState, action);

      expect(state.direct.chatName).toBe(longName);
      expect(state.direct.chatName.length).toBe(1000);
    });

    it('should handle unicode characters', () => {
      const unicodeName = 'Chat 中文 العربية 🚀 emoji';
      const action = NewChatActions.directChatNameChanged({ chatName: unicodeName });
      const state = newChatReducer(initialNewChatState, action);

      expect(state.direct.chatName).toBe(unicodeName);
    });
  });

  describe('directRecipientInputChanged', () => {
    it('should set direct recipient input', () => {
      const action = NewChatActions.directRecipientInputChanged({ recipientInput: 'user@example.com' });
      const state = newChatReducer(initialNewChatState, action);

      expect(state.direct.recipientInput).toBe('user@example.com');
      expect(state.direct.chatName).toBe('');
    });

    it('should update recipient input without affecting chat name', () => {
      const previousState: NewChatState = {
        ...initialNewChatState,
        direct: {
          chatName: 'My Chat',
          recipientInput: 'old@example.com'
        }
      };

      const action = NewChatActions.directRecipientInputChanged({ recipientInput: 'new@example.com' });
      const state = newChatReducer(previousState, action);

      expect(state.direct.recipientInput).toBe('new@example.com');
      expect(state.direct.chatName).toBe('My Chat');
    });

    it('should not affect group or AI chat state', () => {
      const previousState: NewChatState = {
        direct: {
          chatName: '',
          recipientInput: 'old@test.com'
        },
        group: {
          chatName: 'Group',
          recipientInput: 'group@test.com',
          recipients: []
        },
        ai: {
          chatName: 'AI'
        }
      };

      const action = NewChatActions.directRecipientInputChanged({ recipientInput: 'new@test.com' });
      const state = newChatReducer(previousState, action);

      expect(state.direct.recipientInput).toBe('new@test.com');
      expect(state.group.recipientInput).toBe('group@test.com');
      expect(state.ai.chatName).toBe('AI');
    });

    it('should handle empty string', () => {
      const previousState: NewChatState = {
        ...initialNewChatState,
        direct: {
          chatName: '',
          recipientInput: 'user@example.com'
        }
      };

      const action = NewChatActions.directRecipientInputChanged({ recipientInput: '' });
      const state = newChatReducer(previousState, action);

      expect(state.direct.recipientInput).toBe('');
    });

    it('should handle partial email input', () => {
      const action = NewChatActions.directRecipientInputChanged({ recipientInput: 'john' });
      const state = newChatReducer(initialNewChatState, action);

      expect(state.direct.recipientInput).toBe('john');
    });

    it('should handle name instead of email', () => {
      const action = NewChatActions.directRecipientInputChanged({ recipientInput: 'John Doe' });
      const state = newChatReducer(initialNewChatState, action);

      expect(state.direct.recipientInput).toBe('John Doe');
    });

    it('should handle recipient input with whitespace', () => {
      const action = NewChatActions.directRecipientInputChanged({ recipientInput: '  user@example.com  ' });
      const state = newChatReducer(initialNewChatState, action);

      expect(state.direct.recipientInput).toBe('  user@example.com  ');
    });

    it('should handle special characters in email', () => {
      const action = NewChatActions.directRecipientInputChanged({ recipientInput: 'user+tag@example.co.uk' });
      const state = newChatReducer(initialNewChatState, action);

      expect(state.direct.recipientInput).toBe('user+tag@example.co.uk');
    });
  });

  describe('directChatReset', () => {
    it('should reset direct chat to initial state', () => {
      const previousState: NewChatState = {
        ...initialNewChatState,
        direct: {
          chatName: 'Some Chat',
          recipientInput: 'user@example.com'
        }
      };

      const action = NewChatActions.directChatReset();
      const state = newChatReducer(previousState, action);

      expect(state.direct).toEqual(initialNewChatState.direct);
      expect(state.direct.chatName).toBe('');
      expect(state.direct.recipientInput).toBe('');
    });

    it('should not affect group or AI chat state when resetting direct chat', () => {
      const previousState: NewChatState = {
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

      const action = NewChatActions.directChatReset();
      const state = newChatReducer(previousState, action);

      expect(state.direct.chatName).toBe('');
      expect(state.direct.recipientInput).toBe('');
      expect(state.group.chatName).toBe('Group Chat');
      expect(state.group.recipientInput).toBe('group@test.com');
      expect(state.group.recipients).toEqual(['user1@test.com', 'user2@test.com']);
      expect(state.ai.chatName).toBe('AI Chat');
    });

    it('should be idempotent when called multiple times', () => {
      const previousState: NewChatState = {
        ...initialNewChatState,
        direct: {
          chatName: 'Test',
          recipientInput: 'test@test.com'
        }
      };

      const action = NewChatActions.directChatReset();
      const state1 = newChatReducer(previousState, action);
      const state2 = newChatReducer(state1, action);
      const state3 = newChatReducer(state2, action);

      expect(state1.direct).toEqual(initialNewChatState.direct);
      expect(state2.direct).toEqual(initialNewChatState.direct);
      expect(state3.direct).toEqual(initialNewChatState.direct);
    });

    it('should reset even when initial state already matches', () => {
      const action = NewChatActions.directChatReset();
      const state = newChatReducer(initialNewChatState, action);

      expect(state.direct).toEqual(initialNewChatState.direct);
    });
  });

  describe('Action Sequences', () => {
    it('should handle sequence of chat name updates', () => {
      let state = initialNewChatState;

      state = newChatReducer(state, NewChatActions.directChatNameChanged({ chatName: 'First' }));
      expect(state.direct.chatName).toBe('First');

      state = newChatReducer(state, NewChatActions.directChatNameChanged({ chatName: 'Second' }));
      expect(state.direct.chatName).toBe('Second');

      state = newChatReducer(state, NewChatActions.directChatNameChanged({ chatName: 'Third' }));
      expect(state.direct.chatName).toBe('Third');
    });

    it('should handle sequence of recipient input updates', () => {
      let state = initialNewChatState;

      state = newChatReducer(state, NewChatActions.directRecipientInputChanged({ recipientInput: 'j' }));
      expect(state.direct.recipientInput).toBe('j');

      state = newChatReducer(state, NewChatActions.directRecipientInputChanged({ recipientInput: 'jo' }));
      expect(state.direct.recipientInput).toBe('jo');

      state = newChatReducer(state, NewChatActions.directRecipientInputChanged({ recipientInput: 'john@example.com' }));
      expect(state.direct.recipientInput).toBe('john@example.com');
    });

    it('should handle interleaved chat name and recipient input updates', () => {
      let state = initialNewChatState;

      state = newChatReducer(state, NewChatActions.directChatNameChanged({ chatName: 'Chat 1' }));
      state = newChatReducer(state, NewChatActions.directRecipientInputChanged({ recipientInput: 'user1@test.com' }));
      
      expect(state.direct.chatName).toBe('Chat 1');
      expect(state.direct.recipientInput).toBe('user1@test.com');

      state = newChatReducer(state, NewChatActions.directChatNameChanged({ chatName: 'Chat 2' }));
      
      expect(state.direct.chatName).toBe('Chat 2');
      expect(state.direct.recipientInput).toBe('user1@test.com');
    });

    it('should handle complete flow: set values then reset', () => {
      let state = initialNewChatState;

      state = newChatReducer(state, NewChatActions.directChatNameChanged({ chatName: 'Test Chat' }));
      state = newChatReducer(state, NewChatActions.directRecipientInputChanged({ recipientInput: 'test@example.com' }));
      
      expect(state.direct.chatName).toBe('Test Chat');
      expect(state.direct.recipientInput).toBe('test@example.com');

      state = newChatReducer(state, NewChatActions.directChatReset());
      
      expect(state.direct.chatName).toBe('');
      expect(state.direct.recipientInput).toBe('');
    });

    it('should handle reset followed by new values', () => {
      let state = initialNewChatState;

      state = newChatReducer(state, NewChatActions.directChatNameChanged({ chatName: 'First Chat' }));
      state = newChatReducer(state, NewChatActions.directChatReset());
      state = newChatReducer(state, NewChatActions.directChatNameChanged({ chatName: 'Second Chat' }));
      state = newChatReducer(state, NewChatActions.directRecipientInputChanged({ recipientInput: 'new@test.com' }));

      expect(state.direct.chatName).toBe('Second Chat');
      expect(state.direct.recipientInput).toBe('new@test.com');
    });
  });

  describe('State Immutability', () => {
    it('should not mutate the original state when setting chat name', () => {
      const originalState = { ...initialNewChatState };
      const action = NewChatActions.directChatNameChanged({ chatName: 'New Chat' });
      
      newChatReducer(originalState, action);

      expect(originalState).toEqual(initialNewChatState);
    });

    it('should not mutate the original state when setting recipient input', () => {
      const originalState = { ...initialNewChatState };
      const action = NewChatActions.directRecipientInputChanged({ recipientInput: 'user@test.com' });
      
      newChatReducer(originalState, action);

      expect(originalState).toEqual(initialNewChatState);
    });

    it('should not mutate the original state when resetting', () => {
      const originalState: NewChatState = {
        ...initialNewChatState,
        direct: {
          chatName: 'Test',
          recipientInput: 'test@test.com'
        }
      };
      const originalStateCopy = JSON.parse(JSON.stringify(originalState));
      const action = NewChatActions.directChatReset();
      
      newChatReducer(originalState, action);

      expect(originalState).toEqual(originalStateCopy);
    });

    it('should create new state reference for each action', () => {
      const state1 = initialNewChatState;
      const state2 = newChatReducer(state1, NewChatActions.directChatNameChanged({ chatName: 'Test' }));
      const state3 = newChatReducer(state2, NewChatActions.directRecipientInputChanged({ recipientInput: 'test@test.com' }));

      expect(state1).not.toBe(state2);
      expect(state2).not.toBe(state3);
      expect(state1).not.toBe(state3);
    });

    it('should create new direct object reference when updating', () => {
      const state1 = initialNewChatState;
      const state2 = newChatReducer(state1, NewChatActions.directChatNameChanged({ chatName: 'Test' }));

      expect(state1.direct).not.toBe(state2.direct);
    });
  });

});
