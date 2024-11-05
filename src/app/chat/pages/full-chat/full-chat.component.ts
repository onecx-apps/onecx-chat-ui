import { Component } from '@angular/core';
import { ChatMessage } from 'src/app/shared/components/chat/chat.viewmodel';
import { MessageType } from 'src/app/shared/generated';

@Component({
  selector: 'app-full-chat',
  templateUrl: './full-chat.component.html',
  styleUrl: './full-chat.component.css',
})
export class FullChatComponent {
  mockChatMessages: ChatMessage[] = [
    {
      creationDate: new Date('2024-11-04T13:00:00'),
      id: '1',
      type: MessageType.System,
      text: 'Welcome to the chat!',
      userName: 'System',
    },
    {
      creationDate: new Date('2024-11-04T13:01:00'),
      id: '2',
      type: MessageType.Human,
      text: 'Hello, I need some help with my account.',
      userName: 'User123',
    },
    {
      creationDate: new Date('2024-11-04T13:02:00'),
      id: '3',
      type: MessageType.Assistant,
      text: 'Sure, I can help you with that. What seems to be the problem?',
      userName: 'Assistant',
    },
    {
      creationDate: new Date('2024-11-04T13:03:00'),
      id: '4',
      type: MessageType.Human,
      text: 'I forgot my password and cannot log in.',
      userName: 'User123',
    },
    {
      creationDate: new Date('2024-11-04T13:04:00'),
      id: '5',
      type: MessageType.Assistant,
      text: 'No worries, I can help you reset your password. Please follow the instructions sent to your email.',
      userName: 'Assistant',
    },
    {
      creationDate: new Date('2024-11-04T13:05:00'),
      id: '6',
      type: MessageType.Human,
      text: 'Thank you!',
      userName: 'User123',
    },
    {
      creationDate: new Date('2024-11-04T13:06:00'),
      id: '7',
      type: MessageType.Assistant,
      text: 'You’re welcome! If you need any further assistance, feel free to ask.',
      userName: 'Assistant',
    },
  ];

  sendMessage(message: string) {
    const newMessage: ChatMessage = {
      creationDate: new Date(),
      id: (this.mockChatMessages.length + 1).toString(),
      type: MessageType.Human,
      text: message,
      userName: 'User123',
    };
    this.mockChatMessages.push(newMessage);
  }
}
