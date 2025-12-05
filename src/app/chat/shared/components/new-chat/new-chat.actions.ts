import { createAction, props } from '@ngrx/store';

// Direct Chat Actions
export const setDirectChatName = createAction(
  '[NewChat] Set Direct Chat Name',
  props<{ chatName: string }>()
);

export const setDirectRecipientInput = createAction(
  '[NewChat] Set Direct Recipient Input',
  props<{ recipientInput: string }>()
);

// Group Chat Actions
export const setGroupChatName = createAction(
  '[NewChat] Set Group Chat Name',
  props<{ chatName: string }>()
);


// AI Chat Actions
export const setAIChatName = createAction(
  '[NewChat] Set AI Chat Name',
  props<{ chatName: string }>()
);

// Reset Actions
export const resetDirectChat = createAction('[NewChat] Reset Direct Chat');
export const resetGroupChat = createAction('[NewChat] Reset Group Chat');
export const resetAIChat = createAction('[NewChat] Reset AI Chat');
