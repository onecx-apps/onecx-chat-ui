import { Chat, ChatPageResult, Message, MessagePageResult } from "src/app/shared/generated"


export interface ChatComponentState {
    chatPageResult: ChatPageResult
    messagePageResult: MessagePageResult
    loading: boolean
    loaded: boolean
    chat: Chat
    messages: Message[]
}