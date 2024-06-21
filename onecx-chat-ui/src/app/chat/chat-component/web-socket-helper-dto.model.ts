import { Message } from "src/app/shared/generated";

export interface WebSocketHelperDTO {
    message: Message
    chatId: string
}