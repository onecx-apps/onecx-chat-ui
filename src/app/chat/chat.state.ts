import { ChatAssistantState } from './pages/chat-assistant/chat-assistant.state';
import { ChatSearchState } from './pages/chat-search/chat-search.state';
import { State as ChatNewGroupState } from './pages/chat-new-group/chat-new-group.reducer';

export interface ChatState {
  search: ChatSearchState;
  assistant: ChatAssistantState;
  newGroup: ChatNewGroupState;
}
