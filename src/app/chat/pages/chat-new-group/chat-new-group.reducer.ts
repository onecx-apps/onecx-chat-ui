import { createReducer, on } from '@ngrx/store';
import * as ChatNewGroupActions from './chat-new-group.actions';

export interface State {
  chatName: string;
  recipientInput: string;
  recipients: string[];
}

export const initialState: State = {
  chatName: 'Group Chat',
  recipientInput: '',
  recipients: []
};

export const chatNewGroupReducer = createReducer(
  initialState,
  on(ChatNewGroupActions.setChatName, (state, { chatName }) => ({
    ...state,
    chatName
  })),
  on(ChatNewGroupActions.setRecipientInput, (state, { recipientInput }) => ({
    ...state,
    recipientInput
  })),
  on(ChatNewGroupActions.addRecipient, (state) => {
    const trimmedInput = state.recipientInput.trim();
    const isDuplicate = state.recipients.some(
      recipient => recipient.toLowerCase() === trimmedInput.toLowerCase()
    );
    
    return trimmedInput && !isDuplicate
      ? {
          ...state,
          recipients: [...state.recipients, trimmedInput],
          recipientInput: ''
        }
      : { ...state, recipientInput: '' };
  }),
  on(ChatNewGroupActions.removeRecipient, (state, { index }) => ({
    ...state,
    recipients: state.recipients.filter((_, i) => i !== index)
  }))
);
