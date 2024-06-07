import { ChatTypeDTO } from "./enums"
import { ParticipantDTO } from "./participantDTO.model"

export interface CreateChatDTO {
    version: number
    creationDate: Date
    creationUser: string
    modificationDate: Date
    modificationUser: string
    id: string
    type: ChatTypeDTO
    topic: string
    summary: string
    appId: string
    participants: ParticipantDTO[]
}