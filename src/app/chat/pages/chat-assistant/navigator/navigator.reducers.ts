import { createReducer, on } from '@ngrx/store';
import { NavigatorActions } from './navigator.actions';
import { NavigatorState, initialNavigatorState } from './navigator.state';
import { ChatAssistantActions } from '../chat-assistant.actions';

export const navigatorReducer = createReducer(
  initialNavigatorState,

  on(NavigatorActions.chatModeSelected, (state): NavigatorState => ({
    ...state,
    currentPage: 'newChat',
  })),

  on(ChatAssistantActions.chatModeSelected, (state): NavigatorState => ({
    ...state,
    currentPage: 'newChat',
  })),

  on(NavigatorActions.chatModeDeselected, (state): NavigatorState => ({
    ...state,
    currentPage: null,
  })),

  on(ChatAssistantActions.chatModeDeselected, (state): NavigatorState => ({
    ...state,
    currentPage: null,
  })),

  on(NavigatorActions.newChatButtonClicked, (state): NavigatorState => ({
    ...state,
    currentPage: 'newChat',
  })),

  on(ChatAssistantActions.newChatButtonClicked, (state): NavigatorState => ({
    ...state,
    currentPage: 'newChat',
  })),

  on(ChatAssistantActions.chatCreateButtonClicked, (state): NavigatorState => ({
    ...state,
    currentPage: 'chatList',
  })),

  on(NavigatorActions.navigateToChatList, (state): NavigatorState => ({
    ...state,
    currentPage: 'chatList',
  })),

  on(ChatAssistantActions.navigateToChatList, (state): NavigatorState => ({
    ...state,
    currentPage: 'chatList',
  })),

  on(NavigatorActions.navigateToChat, (state): NavigatorState => ({
    ...state,
    currentPage: 'chat',
  })),

  on(ChatAssistantActions.chatChosen, (state): NavigatorState => ({
    ...state,
    currentPage: 'chat',
  })),

  on(NavigatorActions.backFromNewChat, (state): NavigatorState => ({
    ...state,
    currentPage: null,
  })),

  on(NavigatorActions.backFromChatList, (state): NavigatorState => ({
    ...state,
    currentPage: null,
  })),

  on(NavigatorActions.backFromChat, (state): NavigatorState => ({
    ...state,
    currentPage: 'chatList',
  }))
);
