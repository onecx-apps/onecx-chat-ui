import { createActionGroup, props } from "@ngrx/store";
import { Chat, ChatPageResult, ChatSearchCriteria, CreateChat, CreateMessage, Message } from "src/app/shared/generated";


export const ChatComponentActions = createActionGroup ({
    source: 'ChatComponent',
    events: {
        'chat page opened': props<{searchCriteria: ChatSearchCriteria}>(),
        'chat page result received': props<{chatPageResult: ChatPageResult;}>(),
        'chat page result loading failed': props<{error: string | null}>(),
        
        'create chat clicked': props<{createChat: CreateChat}>(),
        'chat created': props<{chat: Chat}>(),
        'chat creation failed': props<{error: string | null}>(),

        'get chat by id': props<{id: string}>(),
        'get chat by id success': props<{chat: Chat}>(),
        'get chat by id failed': props<{error: string | null}>(),

        'get messages by id': props<{id: string}>(),
        'get messages by id success': props<{messages: Message[]}>(),
        'get messages by id failed': props<{error: string | null}>(),

        'send message': props<{chatId: string, createMessage: CreateMessage}>(),
        'send message success': props<{message: Message}>(),
        'send message failed': props<{error: string | null}>()

    },
})