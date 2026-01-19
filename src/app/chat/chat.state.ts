import { ChatAssistantState } from './pages/chat-assistant/chat-assistant.state';
import { ChatSearchState } from './pages/chat-search/chat-search.state';
export interface ChatState {
  search: ChatSearchState;
  assistant: ChatAssistantState;
}