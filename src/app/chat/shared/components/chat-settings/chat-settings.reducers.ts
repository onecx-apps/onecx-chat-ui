import { createReducer, on } from '@ngrx/store';
import { ChatSettingsActions } from './chat-settings.actions';
import { ChatSettingsState, initialChatSettingsState } from './chat-settings.state';
import { ChatAssistantActions } from '../../../pages/chat-assistant/chat-assistant.actions';

export const chatSettingsReducer = createReducer(
  initialChatSettingsState,

  on(ChatSettingsActions.chatNameChanged, (state, { chatName }): ChatSettingsState => ({
    ...state,
    chatName,
  })),

  on(ChatSettingsActions.recipientUserChanged, (state, { recipientUserId }): ChatSettingsState => ({
    ...state,
    recipientUserId: recipientUserId || null,
  })),

  on(ChatSettingsActions.participantsChanged, (state, { participants }): ChatSettingsState => ({
    ...state,
    participants: participants || null,
  })),

  on(ChatAssistantActions.chatModeSelected, (state, { mode }): ChatSettingsState => ({
    ...initialChatSettingsState,
    settingsType: mode as 'ai' | 'direct' | 'group',
  })),

  on(ChatSettingsActions.resetForm, (): ChatSettingsState => initialChatSettingsState),

  on(ChatAssistantActions.chatCreateButtonClicked, (): ChatSettingsState => initialChatSettingsState)
);
