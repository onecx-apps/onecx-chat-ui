import { ChatSettingsType } from '../../shared/components/chat-settings/chat-settings.component';

export function generatePlaceholder(type: ChatSettingsType): string {
  const chatType = getChatTitle(type);
  const now = new Date();
  const dateStr = now.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${chatType} ${dateStr} ${timeStr}`;
}

export function getChatTitle(type: ChatSettingsType): string {
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
