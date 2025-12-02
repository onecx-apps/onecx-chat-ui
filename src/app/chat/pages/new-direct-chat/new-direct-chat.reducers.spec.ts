import { directChatReducer, initialState } from './new-direct-chat.reducers';
import * as DirectChatActions from './new-direct-chat.actions';

describe('directChatReducer', () => {
  it('should return initial state for unknown action', () => {
    const action = { type: 'UNKNOWN' } as any;
    const result = directChatReducer(initialState, action);
    expect(result).toBe(initialState);
  });

  it('should set chat name', () => {
    const action = DirectChatActions.setChatName({ chatName: 'Test Chat' });
    const result = directChatReducer(initialState, action);
    expect(result.chatName).toBe('Test Chat');
    expect(result.recipientInput).toBe('');
  });

  it('should set recipient input', () => {
    const action = DirectChatActions.setRecipientInput({ recipientInput: 'user@example.com' });
    const result = directChatReducer(initialState, action);
    expect(result.recipientInput).toBe('user@example.com');
  });
});
