import { initialState } from './chat-component.reducer';
import { chatComponentFeature } from '../chat.reducers';
import { createChildSelectors } from '@onecx/portal-integration-angular/ngrx';
import { createSelector } from '@ngrx/store';
import { ChatComponentState } from './chat-component.state';
import { Chat, ChatPageResult, Message, MessagePageResult, Participant } from 'src/app/shared/generated';


export const chatComponentSelector = createChildSelectors(
    chatComponentFeature.selectChat,
    initialState
);

export const selectChatPageResults = createSelector(
    chatComponentSelector.selectChatPageResult,
    (chatPageResult): ChatPageResult => {
        return chatPageResult
    }
)

export const selectMessagePageResults = createSelector(
    chatComponentSelector.selectMessagePageResult,
    (messagePageResult): MessagePageResult => {
        return messagePageResult
    }
)

export const selectChat = createSelector(
    chatComponentSelector.selectChat,
    (chat): Chat => {
        return chat
    }
)

export const selectMessages = createSelector(
    chatComponentSelector.selectMessages,
    (messages): Message[] => {
        return messages
    }
)

export const selectChatParticipants = createSelector(
    chatComponentSelector.selectChatParticipants,
    (participants): Participant[] => {
        return participants
    }
)