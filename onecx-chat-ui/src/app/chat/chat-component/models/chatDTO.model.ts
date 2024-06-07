import { ChatTypeDTO } from "./enums"
import { ParticipantDTO } from "./participantDTO.model"


export interface ChatDTO {
    version: number
    creationDate: Date
    creationUser: string
    modificationDate: Date
    id: string
    type: ChatTypeDTO
    topic: string
    summary: string
    appId: string
    participants: ParticipantDTO[]
}

