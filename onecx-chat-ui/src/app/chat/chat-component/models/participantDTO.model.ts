import { ParticipantTypeDTO } from "./enums"

export interface ParticipantDTO {
    version: number
    creationDate: Date
    creationUser: string
    modificationDate: Date
    modificationUser: string
    id: string
    type: ParticipantTypeDTO
    userId: string
    userName: string
    email: string
}