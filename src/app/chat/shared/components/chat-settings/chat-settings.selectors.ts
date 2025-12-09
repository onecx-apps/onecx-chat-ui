import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatSettingsState } from './chat-settings.state';
import { selectSelectedChatMode } from '../../../pages/chat-assistant/chat-assistant.selectors';

export const selectChatSettingsState = createFeatureSelector<ChatSettingsState>('chatSettings');

export const selectChatSettingsType = createSelector(
  selectChatSettingsState,
  (state: ChatSettingsState) => state.settingsType
);

export const selectChatName = createSelector(
  selectChatSettingsState,
  (state: ChatSettingsState) => state.chatName
);

export const selectRecipientUserId = createSelector(
  selectChatSettingsState,
  (state: ChatSettingsState) => state.recipientUserId
);

export const selectParticipants = createSelector(
  selectChatSettingsState,
  (state: ChatSettingsState) => state.participants
);

export const selectChatNamePlaceholder = createSelector(
  selectSelectedChatMode,
  (mode) => generatePlaceholder((mode as 'ai' | 'direct' | 'group') || 'ai')
);

export const selectChatTitle = createSelector(
  selectSelectedChatMode,
  (mode) => getChatTitle((mode as 'ai' | 'direct' | 'group') || 'ai')
);

export function getChatTitle(type: 'ai' | 'direct' | 'group'): string {
  switch (type) {
    case 'ai':
      return 'AI Chat';
    case 'direct':
      return 'Direct Chat';
    case 'group':
      return 'Group Chat';
    default:
      return 'New Chat';
  }
}

export function generatePlaceholder(type: 'ai' | 'direct' | 'group'): string {
  const chatType = getChatTitle(type);
  const now = new Date();
  const dateStr = now.toLocaleDateString('pl-PL', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  const timeStr = now.toLocaleTimeString('pl-PL', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  return `${chatType} ${dateStr} ${timeStr}`;
}
