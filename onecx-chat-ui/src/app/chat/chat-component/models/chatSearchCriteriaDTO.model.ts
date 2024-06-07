import { ChatTypeDTO } from "./enums"

export interface ChatSearchCriteriaDTO {
    type: ChatTypeDTO
    topic: string
    participant: string
    appId: string
    pageNumber: number
    pageSize: number
}