import { createReducer, on } from "@ngrx/store";
import { ChatComponentState } from "./chat-component.state";
import { ChatComponentActions } from "./chat-component.actions";
import { MessageDTO } from "./models/messageDTO.model";
import { ParticipantDTO } from "./models/participantDTO.model";
import { ChatTypeDTO } from "./models/enums";

export const initialState: ChatComponentState = {
    chatPageResult: {
        totalElements: 0,
        size: 0,
        number: 0,
        totalPages: 0, 
        stream: []
    },
    messagePageResult: {
        totalElements: 0,
        size: 0,
        number: 0,
        totalPages: 0,
        stream: []
    },
    chat: {
        version: -1,
        creationDate: new Date(1970, 1, 1),
        creationUser: '',
        modificationDate: new Date(1970, 1, 1),
        id: '',
        type: ChatTypeDTO.AI_CHAT,
        topic: '',
        summary: '',
        appId: '',
        participants: []
    },
    loaded: false,
    loading: false
}

export const chatComponentReducer = createReducer(
    initialState,
    on(
        ChatComponentActions.chatPageOpened,
        (state: ChatComponentState): ChatComponentState => ({
                ...state,
                loading: true,
                loaded: false
            })
    ),
    on(
        ChatComponentActions.chatPageResultReceived,
        (
            state: ChatComponentState,
            {chatPageResult}
        ): ChatComponentState => ({
            ...state,
            loaded: true,
            loading: false,
            chatPageResult: chatPageResult
        })
    ),
    on(
        ChatComponentActions.chatPageResultLoadingFailed,
        (state: ChatComponentState): ChatComponentState => ({
            ...state,
            chatPageResult: {
                totalElements: 0,
                size: 0,
                number: 0,
                totalPages: 0, 
                stream: []
            }
        })
    ),
    on(
        ChatComponentActions.createchatclicked,
        (
            state: ChatComponentState,
            {  }
        ): ChatComponentState => ({
            ...state,
            loading: true,
            loaded: false
        })
    ),
    on(
        ChatComponentActions.chatCreated,
        (
            state: ChatComponentState,
            {  }
        ): ChatComponentState => ({
            ...state,
            loaded: true,
            loading: false,
            // chat: chat
        })
    ),
    on(
        ChatComponentActions.chatCreationFailed,
        (state: ChatComponentState): ChatComponentState => ({     
           ...state,
           loaded: true,
           loading: false
        })
    )
)
