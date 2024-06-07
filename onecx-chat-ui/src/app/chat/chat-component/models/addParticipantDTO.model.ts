import { ParticipantTypeDTO } from "./enums"

export interface AddParticipantDTO {
    version: number
    creationDate: Date
    creationUser: string
    modificationDate: Date
    modificationUser: string
    id: string
    tpye: ParticipantTypeDTO
    userId: string
    userName: string
    email: string
}
