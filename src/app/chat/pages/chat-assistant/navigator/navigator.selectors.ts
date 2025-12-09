import { createSelector } from '@ngrx/store';
import { chatAssistantFeature } from '../../../chat.reducers';
import { NavigatorState } from './navigator.state';

export const selectNavigatorState = createSelector(
  chatAssistantFeature.selectChatAssistantState,
  (state) => state.navigator
);

export const selectNavigatorCurrentPage = createSelector(
  selectNavigatorState,
  (state: NavigatorState) => state.currentPage
);

export const selectIsOnInitialScreen = createSelector(
  selectNavigatorCurrentPage,
  (currentPage) => currentPage === null
);

export const selectIsOnNewChatForm = createSelector(
  selectNavigatorCurrentPage,
  (currentPage) => currentPage === 'newChat'
);

export const selectIsOnChatList = createSelector(
  selectNavigatorCurrentPage,
  (currentPage) => currentPage === 'chatList'
);

export const selectIsOnChatView = createSelector(
  selectNavigatorCurrentPage,
  (currentPage) => currentPage === 'chat'
);
