import { MessageDTO } from "./messageDTO.model"

export interface MessagePageResultDTO {
    totalElements: number
    number: number
    size: number
    totalPages: number
    stream: MessageDTO[]
}