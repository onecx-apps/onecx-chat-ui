import { Chat, Message } from 'src/app/shared/generated';

export interface ChatAssistantState {
  chats: Chat[];
  currentChat: Chat | undefined;
  currentMessages: Message[] | undefined;
}
