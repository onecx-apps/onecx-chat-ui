import { ChatDTO } from "./models/chatDTO.model";
import { ChatPageResultDTO } from "./models/chatPageResultDTO.model";
import { MessagePageResultDTO } from "./models/messagePageResultDTO";

export interface ChatComponentState {
    chatPageResult: ChatPageResultDTO
    messagePageResult: MessagePageResultDTO
    loading: boolean
    loaded: boolean
    chat: ChatDTO
}