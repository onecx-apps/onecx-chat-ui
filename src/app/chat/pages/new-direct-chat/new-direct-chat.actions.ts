import { createAction, props } from '@ngrx/store';

export const setChatName = createAction('[DirectChat] Set Chat Name', props<{ chatName: string }>());
export const setRecipientInput = createAction('[DirectChat] Set Recipient Input', props<{ recipientInput: string }>());
