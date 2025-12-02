import { ChatAssistantState } from './pages/chat-assistant/chat-assistant.state';
import { ChatSearchState } from './pages/chat-search/chat-search.state';
import { State as DirectChatState } from './pages/new-direct-chat/new-direct-chat.reducers';
export interface ChatState {
  search: ChatSearchState;
  assistant: ChatAssistantState;
  direct: DirectChatState;
}
