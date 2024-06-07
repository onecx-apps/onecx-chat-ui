import { ChatDTO } from "./chatDTO.model"

export interface ChatPageResultDTO {
    totalElements: number
    number: number
    size: number
    totalPages: number
    stream: ChatDTO[]

}