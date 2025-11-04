import * as ChatNewGroupSelectors from './chat-new-group.selectors';

describe('ChatNewGroup Selectors', () => {
  const mockState = {
    chat: {
      newGroup: {
        chatName: 'Test Group',
        recipientInput: 'test@example.com',
        recipients: ['user1@test.com', 'user2@test.com']
      }
    }
  } as any;

  describe('selectChatNewGroup', () => {
    it('should select the newGroup state', () => {
      const result = ChatNewGroupSelectors.selectChatNewGroup.projector(mockState.chat);
      expect(result).toEqual(mockState.chat.newGroup);
    });
  });

  describe('selectChatName', () => {
    it('should select the chat name', () => {
      const result = ChatNewGroupSelectors.selectChatName.projector(mockState.chat.newGroup);
      expect(result).toBe('Test Group');
    });

    it('should return empty string when chat name is undefined', () => {
      const result = ChatNewGroupSelectors.selectChatName.projector(undefined as any);
      expect(result).toBe('');
    });

    it('should return empty string when state is null', () => {
      const result = ChatNewGroupSelectors.selectChatName.projector(null as any);
      expect(result).toBe('');
    });
  });

  describe('selectRecipientInput', () => {
    it('should select the recipient input', () => {
      const result = ChatNewGroupSelectors.selectRecipientInput.projector(mockState.chat.newGroup);
      expect(result).toBe('test@example.com');
    });

    it('should return empty string when recipient input is undefined', () => {
      const result = ChatNewGroupSelectors.selectRecipientInput.projector(undefined as any);
      expect(result).toBe('');
    });

    it('should return empty string when state is null', () => {
      const result = ChatNewGroupSelectors.selectRecipientInput.projector(null as any);
      expect(result).toBe('');
    });
  });

  describe('selectRecipients', () => {
    it('should select the recipients array', () => {
      const result = ChatNewGroupSelectors.selectRecipients.projector(mockState.chat.newGroup);
      expect(result).toEqual(['user1@test.com', 'user2@test.com']);
    });

    it('should return empty array when recipients is undefined', () => {
      const result = ChatNewGroupSelectors.selectRecipients.projector(undefined as any);
      expect(result).toEqual([]);
    });

    it('should return empty array when state is null', () => {
      const result = ChatNewGroupSelectors.selectRecipients.projector(null as any);
      expect(result).toEqual([]);
    });
  });
});
