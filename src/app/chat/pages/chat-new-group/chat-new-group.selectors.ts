import { createSelector } from '@ngrx/store';
import { State } from './chat-new-group.reducer';
import { chatFeature } from '../../chat.reducers';

export const selectChatNewGroup = createSelector(
  chatFeature.selectChatState,
  (chatState) => chatState.newGroup
);

export const selectChatName = createSelector(
  selectChatNewGroup,
  state => state?.chatName ?? ''
);

export const selectRecipientInput = createSelector(
  selectChatNewGroup,
  state => state?.recipientInput ?? ''
);

export const selectRecipients = createSelector(
  selectChatNewGroup,
  state => state?.recipients ?? []
);
