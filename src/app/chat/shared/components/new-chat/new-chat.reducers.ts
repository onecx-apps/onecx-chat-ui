import { createReducer, on } from '@ngrx/store';
import { initialNewChatState } from './new-chat.state';
import * as NewChatActions from './new-chat.actions';

export const newChatReducer = createReducer(
  initialNewChatState,
  
  // Direct Chat Reducers
  on(NewChatActions.setDirectChatName, (state, { chatName }) => ({
    ...state,
    direct: { ...state.direct, chatName }
  })),
  
  on(NewChatActions.setDirectRecipientInput, (state, { recipientInput }) => ({
    ...state,
    direct: { ...state.direct, recipientInput }
  })),
  
  on(NewChatActions.resetDirectChat, (state) => ({
    ...state,
    direct: initialNewChatState.direct
  })),
);
