import { MessageTypeDTO } from "./enums"

export interface MessageDTO {
    version: number
    creationDate: Date
    creationUser: string
    modificationDate: string
    modificationUser: string
    id: string
    type: MessageTypeDTO
    text: string
    userName: string
    reliability: number
}