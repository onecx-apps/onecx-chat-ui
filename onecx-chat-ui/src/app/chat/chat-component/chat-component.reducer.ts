import { createReducer, on } from "@ngrx/store";
import { ChatComponentState } from "./chat-component.state";
import { ChatComponentActions } from "./chat-component.actions";
import { ChatType } from "src/app/shared/generated";
import { Statement } from "@angular/compiler";

export const initialState: ChatComponentState = {
    chatPageResult: {
        totalElements: -1,
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
        creationDate: '',
        creationUser: '',
        modificationDate: '',
        id: 'NewChat',
        type: ChatType.AiChat,
        topic: '',
        summary: '',
        appId: '',
        participants: []
    },
    messages: [],
    chatParticipants: [],
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
        ChatComponentActions.createChatClicked,
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
            { chat }
        ): ChatComponentState => ({
            ...state,
            loaded: true,
            loading: false,
            chat: chat
        })
    ),
    on(
        ChatComponentActions.chatCreationFailed,
        (state: ChatComponentState): ChatComponentState => ({     
           ...state,
           loaded: true,
           loading: false
        })
    ),

    on(
        ChatComponentActions.getChatById,
        (
            (state: ChatComponentState): ChatComponentState => ({
                ...state,
                loaded: false,
                loading: true
            }) 
        )
    ),
    on(
        ChatComponentActions.getChatByIdSuccess,
        (
            state: ChatComponentState,
            {chat}
        ): ChatComponentState => ({
            ...state,
            loaded: true,
            loading: false,
            chat: chat
        })
    ),
    on(
        ChatComponentActions.getChatByIdFailed,
        (state: ChatComponentState): ChatComponentState => ({
            ...state,
            chat: {
                id: '-1',
                type: ChatType.AiChat    
            }
        })
    ),

    on(
        ChatComponentActions.getChatById,
        (
            (state: ChatComponentState): ChatComponentState => ({
                ...state,
                loaded: false,
                loading: true
            }) 
        )
    ),
    on(
        ChatComponentActions.getMessagesByIdSuccess,
        (
            state: ChatComponentState,
            {messages}
        ): ChatComponentState => ({
            ...state,
            loaded: true,
            loading: false,
            messages: messages
        })
    ),
    on(
        ChatComponentActions.getMessagesByIdFailed,
        (state: ChatComponentState): ChatComponentState => ({
            ...state,
            messages: []
        })
    ),

    on(
        ChatComponentActions.sendMessage,
        (
            (state: ChatComponentState): ChatComponentState => ({
                ...state,
                loaded: false,
                loading: true
            }) 
        )
    ),
    on(
        ChatComponentActions.sendMessageSuccess,
        (
            state: ChatComponentState,
            {message}
        ): ChatComponentState => ({
            ...state,
            loaded: true,
            loading: false,
            messages: [...state.messages, message]
        })
    ),
    on(
        ChatComponentActions.sendMessageFailed,
        (state: ChatComponentState): ChatComponentState => ({
            ...state,
        })
    ),

    on(
        ChatComponentActions.getParticipantsById,
        (
            (state: ChatComponentState): ChatComponentState => ({
                ...state,
                loaded: false,
                loading: true
            })
        )
    ),
    on(
        ChatComponentActions.getParticipantsByIdSuccess,
        (
            state: ChatComponentState,
            {participants}
        ): ChatComponentState => ({
            ...state,
            loaded: true,
            loading: false,
            chatParticipants: participants
        })
    ),
    on(
        ChatComponentActions.getParticipantsByIdFailed,
        (state: ChatComponentState): ChatComponentState => ({
            ...state
        })
    ),

    on(
        ChatComponentActions.addParticipant,
        (
            (state: ChatComponentState): ChatComponentState => ({
                ...state,
                loaded: false,
                loading: true
            })
        )
    ),
    on(
        ChatComponentActions.addParticipantSuccess,
        (
            state: ChatComponentState,
            {participant}
        ): ChatComponentState => ({
            ...state,
            loaded: true,
            loading: false,
        })
    ),
    on(
        ChatComponentActions.addParticipantFailed,
        (state: ChatComponentState): ChatComponentState => ({
            ...state
        })
    ),

    on(
        ChatComponentActions.removeParticipant,
        (
            (state: ChatComponentState): ChatComponentState => ({
                ...state,
                loaded: false,
                loading: true
            })
        )
    ),
    on(
        ChatComponentActions.removeParticipantSuccess,
        (
            state: ChatComponentState,
            {participant}
        ): ChatComponentState => ({
            ...state,
            loaded: true,
            loading: false,
        })
    ),
    on(
        ChatComponentActions.removeParticipantFailed,
        (state: ChatComponentState): ChatComponentState => ({
            ...state
        })
    ),

    on(
        ChatComponentActions.updateChat,
        (
            (state: ChatComponentState): ChatComponentState => ({
                ...state,
                loaded: false,
                loading: true
            })
        )
    ),
    on(
        ChatComponentActions.updateChatSuccess,
        (
            state: ChatComponentState,
            {chat}
        ): ChatComponentState => ({
            ...state,
            loaded: true,
            loading: false,
            chat: chat
        })
    ),
    on(
        ChatComponentActions.updateChatFailed,
        (state: ChatComponentState): ChatComponentState => ({
            ...state
        })
    ),

    on(
        ChatComponentActions.deleteChat,
        (
            (state: ChatComponentState): ChatComponentState => ({
                ...state,
                loaded: false,
                loading: true
            })
        )
    ),
    on(
        ChatComponentActions.deleteChatSuccess,
        (
            state: ChatComponentState,
            {chat}
        ): ChatComponentState => ({
            ...state,
            loaded: true,
            loading: false,
        })
    ),
    on(
        ChatComponentActions.deleteChatFailed,
        (state: ChatComponentState): ChatComponentState => ({
            ...state
        })
    ),
)
