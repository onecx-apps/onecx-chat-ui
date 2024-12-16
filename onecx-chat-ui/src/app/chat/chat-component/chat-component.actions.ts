import { createActionGroup, props } from "@ngrx/store";
import { Chat, ChatPageResult, ChatSearchCriteria, CreateChat, CreateMessage, Message, Participant, AddParticipant, UpdateChat } from "src/app/shared/generated";


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
        'send message failed': props<{error: string | null}>(),

        'get participants by id': props<{chatId: string}>(),
        'get participants by id success': props<{participants: Participant[]}>(),
        'get participants by id failed': props<{error: string | null}>(),

        'add participant': props<{chatId: string, addParticipant: AddParticipant}>(),
        'add participant success': props<{participant: Participant}>(),
        'add participant failed': props<{error: string | null}>(),
        
        'remove participant': props<{chatId: string, participantId: string}>(),
        'remove participant success': props<{participant: Participant | null}>(),
        'remove participant failed': props<{error: string | null}>(),

        'update chat': props<{chatId: string, updateChat: UpdateChat}>(),
        'update chat success': props<{chat: Chat}>(),
        'update chat failed': props<{error: string | null}>(),

        'delete chat': props<{chatId: string}>(),
        'delete chat success': props<{chat: Chat | null}>(),
        'delete chat failed': props<{error: string | null}>()
    },
})