import { createAction, props } from '@ngrx/store';

export const setChatName = createAction('[Chat New Group] Set Chat Name', props<{ chatName: string }>());
export const setRecipientInput = createAction('[Chat New Group] Set Recipient Input', props<{ recipientInput: string }>());
export const addRecipient = createAction('[Chat New Group] Add Recipient');
export const removeRecipient = createAction('[Chat New Group] Remove Recipient', props<{ index: number }>());
