/**
 * onecx-chat-ui-bff
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Chat } from './chat';


export interface ChatSearchResponse { 
    results: Array<Chat>;
    /**
     * Total number of results on the server.
     */
    totalNumberOfResults: number;
}

