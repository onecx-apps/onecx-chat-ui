/**
 * onecx-chat-ui-bff
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { MessageType } from './messageType';


export interface Message { 
    version?: number;
    creationDate?: string;
    creationUser?: string;
    modificationDate?: string;
    modificationUser?: string;
    id?: string;
    type: MessageType;
    text?: string;
    userName?: string;
    reliability?: number;
}


