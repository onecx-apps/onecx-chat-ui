import { MessageTypeDTO } from "./enums"

export interface CreateMessageDTO {
    version: number
    creationDate: Date
    creationUser: string
    modificationDate: Date
    modificationUser: string
    id: string
    text: string
    type: MessageTypeDTO
    userName: string
    reliability: number
}