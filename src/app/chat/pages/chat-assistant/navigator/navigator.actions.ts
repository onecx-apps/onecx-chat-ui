import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const NavigatorActions = createActionGroup({
  source: 'Navigator',
  events: {
    'Chat Mode Selected': props<{ mode: string }>(),
    'Chat Mode Deselected': emptyProps(),
    'New Chat Button Clicked': emptyProps(),
    'Navigate To Chat List': emptyProps(),
    'Navigate To Chat': props<{ chatId: string }>(),
    'Back From New Chat': emptyProps(),
    'Back From Chat List': emptyProps(),
    'Back From Chat': emptyProps(),
  },
});
