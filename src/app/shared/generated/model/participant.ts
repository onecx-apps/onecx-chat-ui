/**
 * onecx-chat-ui-bff
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ParticipantType } from './participantType';


export interface Participant { 
    version?: number;
    creationDate?: string;
    creationUser?: string;
    modificationDate?: string;
    modificationUser?: string;
    id?: string;
    type: ParticipantType;
    userId: string;
    userName?: string;
    email?: string;
}



