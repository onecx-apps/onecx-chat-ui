import { getChatTitle } from './chat-assistant.utils';

describe('getChatTitle', () => {
  it('returns "AI Chat" for type "ai"', () => {
    expect(getChatTitle('ai')).toBe('AI Chat');
  });

  it('returns "Direct Chat" for type "direct"', () => {
    expect(getChatTitle('direct')).toBe('Direct Chat');
  });

  it('returns "Group Chat" for type "group"', () => {
    expect(getChatTitle('group')).toBe('Group Chat');
  });

  it('returns "New Chat" for unknown type', () => {
    expect(getChatTitle('unknown' as any)).toBe('New Chat');
    expect(getChatTitle(undefined as any)).toBe('New Chat');
    expect(getChatTitle(null as any)).toBe('New Chat');
  });
});
