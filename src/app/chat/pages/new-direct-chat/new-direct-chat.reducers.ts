import { createReducer, on } from '@ngrx/store';
import * as DirectChatActions from './new-direct-chat.actions';

export interface State {
  chatName: string;
  recipientInput: string;
}

export const initialState: State = {
  chatName: 'Direct Chat',
  recipientInput: ''
};

export const directChatReducer = createReducer(
  initialState,
  on(DirectChatActions.setChatName, (state, { chatName }) => ({ ...state, chatName })),
  on(DirectChatActions.setRecipientInput, (state, { recipientInput }) => ({ ...state, recipientInput }))
);
