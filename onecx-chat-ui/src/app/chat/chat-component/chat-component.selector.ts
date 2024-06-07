import { initialState } from './chat-component.reducer';
import { chatComponentFeature } from '../chat.reducers';
import { createChildSelectors } from '@onecx/portal-integration-angular/ngrx';
import { createSelector } from '@ngrx/store';
import { ChatComponentState } from './chat-component.state';
import { ChatPageResultDTO } from './models/chatPageResultDTO.model';
import { MessagePageResultDTO } from './models/messagePageResultDTO';


export const chatComponentSelector = createChildSelectors(
    chatComponentFeature.selectChat,
    initialState
);

export const selectChatPageResults = createSelector(
    chatComponentSelector.selectChatPageResult,
    (chatPageResult): ChatPageResultDTO => {
        return chatPageResult
    }
)

export const selectMessagePageResults = createSelector(
    chatComponentSelector.selectMessagePageResult,
    (messagePageResult): MessagePageResultDTO => {
        return messagePageResult
    }
)