import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ChatSettingsActions = createActionGroup({
  source: 'Chat Settings',
  events: {
    'Chat Name Changed': props<{ chatName: string }>(),
    'Recipient User Changed': props<{ recipientUserId: string }>(),
    'Participants Changed': props<{ participants: string[] }>(),
    'Create Button Clicked': emptyProps(),
    'Form Submitted': props<{
      chatName: string;
      settingsType: 'ai' | 'direct' | 'group';
      recipientUserId?: string;
      participants?: string[];
    }>(),
    'Reset Form': emptyProps(),
  },
});
