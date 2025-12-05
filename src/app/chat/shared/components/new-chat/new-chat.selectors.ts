import { createSelector } from '@ngrx/store';
import { newChatFeature } from '../../../chat.reducers';
import { initialNewChatState } from './new-chat.state';

// Direct Chat Selectors
export const selectDirectChat = createSelector(
  newChatFeature.selectNewChatState,
  (state) => state?.direct ?? initialNewChatState.direct
);

export const selectDirectChatName = createSelector(
  selectDirectChat,
  (state) => state.chatName
);

export const selectDirectRecipientInput = createSelector(
  selectDirectChat,
  (state) => state.recipientInput
);

