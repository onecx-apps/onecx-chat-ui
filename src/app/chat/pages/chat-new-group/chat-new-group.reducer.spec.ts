import { chatNewGroupReducer, initialState } from './chat-new-group.reducer';
import * as ChatNewGroupActions from './chat-new-group.actions';

describe('ChatNewGroupReducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = chatNewGroupReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('setChatName', () => {
    it('should update chat name', () => {
      const action = ChatNewGroupActions.setChatName({ chatName: 'My Group' });
      const result = chatNewGroupReducer(initialState, action);

      expect(result.chatName).toBe('My Group');
      expect(result.recipientInput).toBe('');
      expect(result.recipients).toEqual([]);
    });
  });

  describe('setRecipientInput', () => {
    it('should update recipient input', () => {
      const action = ChatNewGroupActions.setRecipientInput({ recipientInput: 'test@example.com' });
      const result = chatNewGroupReducer(initialState, action);

      expect(result.recipientInput).toBe('test@example.com');
      expect(result.chatName).toBe('Group Chat');
      expect(result.recipients).toEqual([]);
    });
  });

  describe('addRecipient', () => {
    it('should add recipient and clear input when input is not empty', () => {
      const stateWithInput = {
        ...initialState,
        recipientInput: 'test@example.com'
      };
      const action = ChatNewGroupActions.addRecipient();
      const result = chatNewGroupReducer(stateWithInput, action);

      expect(result.recipients).toEqual(['test@example.com']);
      expect(result.recipientInput).toBe('');
    });

    it('should trim whitespace from recipient', () => {
      const stateWithInput = {
        ...initialState,
        recipientInput: '  test@example.com  '
      };
      const action = ChatNewGroupActions.addRecipient();
      const result = chatNewGroupReducer(stateWithInput, action);

      expect(result.recipients).toEqual(['test@example.com']);
      expect(result.recipientInput).toBe('');
    });

    it('should not add recipient when input is empty', () => {
      const action = ChatNewGroupActions.addRecipient();
      const result = chatNewGroupReducer(initialState, action);

      expect(result.recipients).toEqual([]);
      expect(result.recipientInput).toBe('');
    });

    it('should not add recipient when input is only whitespace', () => {
      const stateWithInput = {
        ...initialState,
        recipientInput: '   '
      };
      const action = ChatNewGroupActions.addRecipient();
      const result = chatNewGroupReducer(stateWithInput, action);

      expect(result.recipients).toEqual([]);
      expect(result.recipientInput).toBe('');
    });

    it('should not add duplicate recipient (case-insensitive)', () => {
      const stateWithRecipients = {
        ...initialState,
        recipients: ['test@example.com'],
        recipientInput: 'TEST@EXAMPLE.COM'
      };
      const action = ChatNewGroupActions.addRecipient();
      const result = chatNewGroupReducer(stateWithRecipients, action);

      expect(result.recipients).toEqual(['test@example.com']);
      expect(result.recipientInput).toBe('');
    });

    it('should add new recipient when it is not a duplicate', () => {
      const stateWithRecipients = {
        ...initialState,
        recipients: ['test1@example.com'],
        recipientInput: 'test2@example.com'
      };
      const action = ChatNewGroupActions.addRecipient();
      const result = chatNewGroupReducer(stateWithRecipients, action);

      expect(result.recipients).toEqual(['test1@example.com', 'test2@example.com']);
      expect(result.recipientInput).toBe('');
    });
  });

  describe('removeRecipient', () => {
    it('should remove recipient at specified index', () => {
      const stateWithRecipients = {
        ...initialState,
        recipients: ['test1@example.com', 'test2@example.com', 'test3@example.com']
      };
      const action = ChatNewGroupActions.removeRecipient({ index: 1 });
      const result = chatNewGroupReducer(stateWithRecipients, action);

      expect(result.recipients).toEqual(['test1@example.com', 'test3@example.com']);
    });

    it('should remove first recipient', () => {
      const stateWithRecipients = {
        ...initialState,
        recipients: ['test1@example.com', 'test2@example.com']
      };
      const action = ChatNewGroupActions.removeRecipient({ index: 0 });
      const result = chatNewGroupReducer(stateWithRecipients, action);

      expect(result.recipients).toEqual(['test2@example.com']);
    });

    it('should remove last recipient', () => {
      const stateWithRecipients = {
        ...initialState,
        recipients: ['test1@example.com', 'test2@example.com']
      };
      const action = ChatNewGroupActions.removeRecipient({ index: 1 });
      const result = chatNewGroupReducer(stateWithRecipients, action);

      expect(result.recipients).toEqual(['test1@example.com']);
    });
  });
});
