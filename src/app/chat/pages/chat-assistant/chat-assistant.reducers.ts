import { createReducer, on } from '@ngrx/store';
import { Chat, MessageType } from 'src/app/shared/generated';
import { ChatAssistantActions } from './chat-assistant.actions';
import { ChatAssistantState } from './chat-assistant.state';

export const initialState: ChatAssistantState = {
  chat: {
    chatId: null,
    messages: [],
    isLoadingMessages: false,
    messageError: null,
    settings: {
      chatName: undefined,
      chatMode: undefined,
      recipientUserId: undefined,
      participants: undefined,
    },
  },
  chatList: {
    chats: [],
    isLoadingChats: false,
    chatsError: null,
    selectedChatMode: null,
  },
  shared: {
    currentUser: {
      userId: '123',
      userName: 'human',
      email: 'human@earth.io',
    },
  },
};

const cleanTemp = (m: { id?: string | undefined }) => {
  return m.id !== 'new' && !m?.id?.includes('temp');
};

const baseChatAssistantReducer = createReducer(
  initialState,
  on(ChatAssistantActions.chatsLoaded, (state: ChatAssistantState, action) => ({
    ...state,
    chatList: {
      ...state.chatList,
      chats: action.chats,
      isLoadingChats: false,
      chatsError: null,
    },
  })),
  on(ChatAssistantActions.chatsLoadingFailed, (state: ChatAssistantState, action) => ({
    ...state,
    chatList: {
      ...state.chatList,
      isLoadingChats: false,
      chatsError: action.error,
    },
  })),
  on(ChatAssistantActions.chatChosen, (state: ChatAssistantState, action) => ({
    ...state,
    chat: {
      ...state.chat,
      chatId: action.chatId,
      isLoadingMessages: true,
      messageError: null,
    },
  })),
  on(ChatAssistantActions.chatDetailsReceived, (state: ChatAssistantState, action) => ({
    ...state,
    chat: {
      ...state.chat,
      chatId: action.chat.id ?? null,
      messages: action.messages,
      isLoadingMessages: false,
      messageError: null,
      settings: {
        chatName: undefined,
        chatMode: undefined,
        recipientUserId: undefined,
        participants: undefined,
      },
    },
  })),
  on(ChatAssistantActions.chatDetailsLoadingFailed, (state: ChatAssistantState, action) => ({
    ...state,
    chat: {
      ...state.chat,
      isLoadingMessages: false,
      messageError: action.error,
    },
  })),
  on(ChatAssistantActions.messageSent, (state: ChatAssistantState, action) => ({
    ...state,
    chat: {
      ...state.chat,
      messages: [
        {
          type: MessageType.Human,
          id: 'new',
          text: action.message,
          creationDate: new Date().toISOString(),
        },
        {
          creationDate: new Date().toISOString(),
          id: 'ai-temp',
          type: MessageType.Assistant,
          text: '',
          isLoadingInfo: true,
        },
        ...state.chat.messages.filter(cleanTemp),
      ],
    },
  })),
  on(ChatAssistantActions.messageSendingFailed, (state: ChatAssistantState, action) => ({
    ...state,
    chat: {
      ...state.chat,
      messages: [
        {
          type: MessageType.Human,
          id: 'new',
          text: action.message,
          creationDate: new Date().toISOString(),
          isFailed: true,
        },
        ...state.chat.messages.filter(cleanTemp),
      ],
    },
  })),
  on(ChatAssistantActions.messagesLoaded, (state: ChatAssistantState, action) => ({
    ...state,
    chat: {
      ...state.chat,
      messages: action.messages,
    },
  })),
  on(ChatAssistantActions.chatSelected, (state: ChatAssistantState, action) => ({
    ...state,
    chat: {
      ...state.chat,
      chatId: action.chat.id ?? null,
      messages: [],
      settings: {
        chatName: undefined,
        chatMode: undefined,
        recipientUserId: undefined,
        participants: undefined,
      },
    },
  })),
  on(ChatAssistantActions.messageSentForNewChat, (state: ChatAssistantState, action) => ({
    ...state,
    chat: {
      ...state.chat,
      chatId: action.chat.id ?? null,
      settings: {
        chatName: undefined,
        chatMode: undefined,
        recipientUserId: undefined,
        participants: undefined,
      },
    },
  })),
  on(ChatAssistantActions.chatCreationSuccessful, (state: ChatAssistantState, action) => ({
    ...state,
    chat: {
      ...state.chat,
      chatId: action.chat.id ?? null,
      messages: [],
      settings: {
        chatName: undefined,
        chatMode: undefined,
        recipientUserId: undefined,
        participants: undefined,
      },
    },
    chatList: {
      ...state.chatList,
      chats: [action.chat, ...state.chatList.chats],
    },
  })),
  on(ChatAssistantActions.chatDeletionSuccessful, (state: ChatAssistantState, action) => ({
    ...state,
    chat: initialState.chat,
    chatList: {
      ...state.chatList,
      chats: state.chatList.chats.filter((c: Chat) => c.id !== action.chatId),
    },
  })),
  on(ChatAssistantActions.chatModeSelected, (state, action) => ({
    ...state,
    chatList: {
      ...state.chatList,
      selectedChatMode: action.mode,
    },
    chat: {
      ...initialState.chat,
    },
  })),
  on(ChatAssistantActions.chatModeDeselected, (state) => ({
    ...state,
    chatList: {
      ...state.chatList,
      selectedChatMode: null,
    },
  })),
  on(ChatAssistantActions.chatPanelOpened, (state) => ({
    ...state,
  })),
  on(ChatAssistantActions.chatPanelClosed, (state) => ({
    ...state,
    chatList: {
      ...state.chatList,
      selectedChatMode: null,
    },
  })),
  on(ChatAssistantActions.newChatButtonClicked, (state) => ({
    ...state,
    chat: {
      ...initialState.chat,
    },
  })),
  on(ChatAssistantActions.navigateToChatList, (state) => ({
    ...state,
  })),
  on(ChatAssistantActions.chatCreateButtonClicked, (state, action) => {
    return {
      ...state,
      chat: {
        ...state.chat,
        settings: {
          ...state.chat.settings,
          chatName: action.chatName,
          chatMode: action.chatMode,
          recipientUserId: action.recipientUserId,
          participants: action.participants,
        },
      },
    };
  })
);

export function chatAssistantReducer(state: ChatAssistantState | undefined, action: any): ChatAssistantState {
  const newState = baseChatAssistantReducer(state, action);
  return {
    ...newState
  };
}
