import * as DirectChatSelectors from './new-direct-chat.selectors';
import { ChatState } from '../../chat.state';
import { State as DirectChatState } from './new-direct-chat.reducers';

describe('DirectChatSelectors', () => {
  const directState: DirectChatState = {
    chatName: 'Test Chat',
    recipientInput: 'user@example.com'
  };
  const mockState: ChatState = {
    search: {} as any,
    assistant: {} as any,
    direct: directState
  };

  it('should select direct chat state', () => {
    expect(DirectChatSelectors.selectDirectChat.projector(mockState)).toEqual(directState);
  });

  it('should select chat name', () => {
    expect(DirectChatSelectors.selectChatName.projector(directState)).toBe('Test Chat');
    expect(DirectChatSelectors.selectChatName.projector(undefined as any)).toBe('');
  });

  it('should select recipient input', () => {
    expect(DirectChatSelectors.selectRecipientInput.projector(directState)).toBe('user@example.com');
    expect(DirectChatSelectors.selectRecipientInput.projector(undefined as any)).toBe('');
  });
});
