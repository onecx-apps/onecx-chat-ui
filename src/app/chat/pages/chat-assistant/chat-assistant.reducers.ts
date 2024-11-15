import { createReducer, on } from '@ngrx/store';
import { ChatAssistantActions } from './chat-assistant.actions';
import { ChatAssistantState } from './chat-assistant.state';
import { MessageType } from 'src/app/shared/generated';

export const initialState: ChatAssistantState = {
  // TODO: use onecx user data
  user: {
    userId: '123',
    userName: 'human',
    email: 'human@earth.io',
  },
  chats: [],
  currentChat: undefined,
  currentMessages: undefined,
};

export const chatAssistantReducer = createReducer(
  initialState,
  on(
    ChatAssistantActions.messageSentForNewChat,
    (state: ChatAssistantState, action) => {
      return {
        ...state,
        currentChat: action.chat,
        currentMessages: [
          {
            type: MessageType.Human,
            id: 'new',
            text: action.message,
            creationDate: new Date().toISOString(),
          },
          ...(state.currentMessages ?? []),
        ],
      };
    }
  ),
  on(ChatAssistantActions.messageSent, (state: ChatAssistantState, action) => {
    return {
      ...state,
      currentMessages: [
        {
          type: MessageType.Human,
          id: 'new',
          text: action.message,
          creationDate: new Date().toISOString(),
        },
        ...(state.currentMessages ?? []),
      ],
    };
  }),
  on(ChatAssistantActions.chatsLoaded, (state: ChatAssistantState, action) => {
    return {
      ...state,
      chats: action.chats,
    };
  }),
  on(
    ChatAssistantActions.messagesLoaded,
    (state: ChatAssistantState, action) => {
      return {
        ...state,
        currentMessages: action.messages,
      };
    }
  ),
  on(
    ChatAssistantActions.chatSelected,
    ChatAssistantActions.chatCreationSuccessfull,
    (state: ChatAssistantState, action) => {
      return {
        ...state,
        currentChat: action.chat,
        currentMessages: []
      };
    }
  ),
);
