import { Chat, Message } from '../../../shared/generated';

export interface ChatDetailsViewModel {
  details: Chat | undefined;
  detailsLoadingIndicator: boolean;
  backNavigationPossible: boolean;
  detailsLoaded: boolean;
  messages: Message[] | undefined;
}
