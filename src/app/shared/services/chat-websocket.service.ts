import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  MessageType,
  WebsocketHelper,
} from 'src/app/shared/generated/model/models';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  webSocket!: WebSocket;
  receivedMessage = new BehaviorSubject<WebsocketHelper>({
    chatId: '',
    messageDTO: { type: MessageType.System },
  });
  receivedMessage$ = this.receivedMessage.asObservable();

  readonly URL = 'ws://localhost:8088/chats/socket/';

  constructor(userName: string) {
    this.receivedMessage$.subscribe((value) => {
      console.log(value);
    });
    this.webSocket = new WebSocket(this.URL + userName);
    this.webSocket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      const helper: WebsocketHelper = {
        chatId: data.chatId,
        messageDTO: data.messageDTO,
      };
      console.log('DATA ', data);
      this.receiveStatus(helper);
    });
  }

  receiveStatus(event: WebsocketHelper) {
    this.receivedMessage.next(event);
  }

  diconnectSocket() {
    this.webSocket.close();
  }
}
