import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ChatPageResultDTO } from "./models/chatPageResultDTO.model";
import { ChatSearchCriteriaDTO } from "./models/chatSearchCriteriaDTO.model";
import { CreateChatDTO } from "./models/createChatDTO.model";
import { ChatDTO } from "./models/chatDTO.model";

export const ChatComponentActions = createActionGroup ({
    source: 'ChatComponent',
    events: {
        'chat page opened': props<{
            searchCriteria: ChatSearchCriteriaDTO
        }>(),
        'chat page result received': props<{
            chatPageResult: ChatPageResultDTO;
        }>(),
        'chat page result loading failed': props<{
             error: string | null
        }>(),
        'createChatClicked': props<{
            createChat: CreateChatDTO
        }>,
        'chat created': props<{
            chat: ChatDTO
        }>,
        'chat creation failed': props<{
            error: string | null
        }>
    },
})