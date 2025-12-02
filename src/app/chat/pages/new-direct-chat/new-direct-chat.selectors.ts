import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from '../../chat.state';

export const selectChatFeature = createFeatureSelector<ChatState>('chat');
export const selectDirectChat = createSelector(selectChatFeature, state => state.direct);
export const selectChatName = createSelector(selectDirectChat, state => state?.chatName ?? '');
export const selectRecipientInput = createSelector(selectDirectChat, state => state?.recipientInput ?? '');
