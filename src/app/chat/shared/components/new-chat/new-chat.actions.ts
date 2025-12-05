import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const NewChatActions = createActionGroup({
  source: 'NewChat',
  events: {
    'direct chat name changed': props<{ chatName: string }>(),
    'direct recipient input changed': props<{ recipientInput: string }>(),
    'group chat name changed': props<{ chatName: string }>(),
    'ai chat name changed': props<{ chatName: string }>(),
    'direct chat reset': emptyProps(),
    'group chat reset': emptyProps(),
    'ai chat reset': emptyProps(),
  },
});
