import { Chat } from 'src/app/shared/generated';

export interface ChatAssistantState {
  chats: Chat[];
  currentChat: Chat | undefined;
}
