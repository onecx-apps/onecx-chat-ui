import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    webSocket!: WebSocket
    readonly URL = 'wss://localhost:8081/chats/socket/'

    constructor(userName: String) {
        this.webSocket = new WebSocket(this.URL + userName)
        this.webSocket.addEventListener("message", (event) => {
            this.receiveStatus(event.data)
        })
    }

    receiveStatus(event: any) {
        return event
    }

    diconnectSocket() {

    }
}