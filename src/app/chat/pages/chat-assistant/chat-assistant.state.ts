import { Chat, Message } from 'src/app/shared/generated';

export interface ChatUser {
  userId: string;
  userName: string;
  email: string;
}

export interface ChatPageState {
  chatId: string | null;
  messages: Message[];
  isLoadingMessages: boolean;
  messageError: string | null;
  settings: {
    chatName?: string;
    chatMode?: string;
    recipientUserId?: string;
    participants?: string[];
  } | null;
}

export interface ChatListPageState {
  chats: Chat[];
  isLoadingChats: boolean;
  chatsError: string | null;
  selectedChatMode: string | null; // 'ai', 'direct', 'group'
}

export interface SharedState {
  currentUser: ChatUser | null;
}

export interface ChatAssistantState {
  chat: ChatPageState;
  chatList: ChatListPageState;
  shared: SharedState;
}
