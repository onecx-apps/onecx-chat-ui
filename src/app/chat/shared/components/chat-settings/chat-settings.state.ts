export interface ChatSettingsState {
  settingsType: 'ai' | 'direct' | 'group';
  chatName: string;
  recipientUserId: string | null;
  participants: string[] | null;
}

export const initialChatSettingsState: ChatSettingsState = {
  settingsType: 'ai',
  chatName: '',
  recipientUserId: null,
  participants: null,
};
