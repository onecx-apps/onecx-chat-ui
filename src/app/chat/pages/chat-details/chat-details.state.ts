import { Chat, Message } from '../../../shared/generated';

export interface ChatDetailsState {
  details: Chat | undefined;
  messages: Message[] | undefined;
  detailsLoadingIndicator: boolean;
  detailsLoaded: boolean;
}
