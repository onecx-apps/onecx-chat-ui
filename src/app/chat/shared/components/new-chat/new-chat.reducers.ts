import { createReducer, on } from '@ngrx/store';
import { initialNewChatState } from './new-chat.state';
import { NewChatActions } from './new-chat.actions';

export const newChatReducer = createReducer(
  initialNewChatState,
  
  // Direct Chat Reducers
  on(NewChatActions.directChatNameChanged, (state, { chatName }) => ({
    ...state,
    direct: { ...state.direct, chatName }
  })),
  
  on(NewChatActions.directRecipientInputChanged, (state, { recipientInput }) => ({
    ...state,
    direct: { ...state.direct, recipientInput }
  })),
  
  on(NewChatActions.directChatReset, (state) => ({
    ...state,
    direct: initialNewChatState.direct
  })),
);
