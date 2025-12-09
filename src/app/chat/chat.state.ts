import { ChatSearchState } from './pages/chat-search/chat-search.state';
import { ChatSettingsState } from './shared/components/chat-settings/chat-settings.state';

export interface ChatState {
  search: ChatSearchState;
  chatSettings: ChatSettingsState;
}
