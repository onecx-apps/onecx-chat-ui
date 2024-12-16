/**
 * onecx-chat-ui-bff
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Participant } from './participant';
import { ChatType } from './chatType';


export interface UpdateChat { 
    version?: number;
    creationDate?: string;
    creationUser?: string;
    modificationDate?: string;
    modificationUser?: string;
    id?: string;
    type?: ChatType;
    topic?: string;
    summary?: string;
    appId?: string;
    participants?: Array<Participant>;
}



