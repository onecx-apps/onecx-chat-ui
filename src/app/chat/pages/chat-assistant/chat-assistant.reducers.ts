import { createReducer, on } from '@ngrx/store';
import { ChatAssistantActions } from './chat-assistant.actions';
import { ChatAssistantState } from './chat-assistant.state';

export const initialState: ChatAssistantState = {
  chats: [],
  currentChat: undefined,
};

export const chatAssistantReducer = createReducer(
  initialState,
  on(
    ChatAssistantActions.messageSentForNewChat,
    (state: ChatAssistantState, action) => {
      return {
        ...state,
        currentChat: action.chat,
      };
    }
  )
);
