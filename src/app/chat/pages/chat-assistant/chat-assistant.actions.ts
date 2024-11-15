import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Chat, Message } from 'src/app/shared/generated';

export const ChatAssistantActions = createActionGroup({
  source: 'ChatAssistant',
  events: {
    'navigated to chat assistant': emptyProps(),
    'chats loaded': props<{
      chats: Chat[];
    }>(),
    'chats loading failed': props<{
      error: string | null;
    }>(),
    'message sent': props<{
      message: string;
    }>(),
    'message sent for new chat': props<{
      chat: Chat;
      message: string;
    }>(),
    'message sending successfull': props<{
      message: Message;
    }>(),
    'message sending failed': props<{
      message: string;
      error: string | null;
    }>(),
    'create new chat for message': props<{
      message: string;
    }>(),
    'chat created': emptyProps(),
    'chat creation successfull': props<{
      chat: Chat;
    }>(),
    'chat creation failed': props<{
      error: string | null;
    }>(),
    'current chat deleted': emptyProps(),
    'chat deletion successfull': props<{
      chatId: string;
    }>(),
    'chat deletion failed': props<{
      error: string | null;
    }>(),
    'chat selected': props<{
      chat: Chat;
    }>(),
    'update current chat topic': props<{
      topic: string;
    }>(),
    'messages loaded': props<{
      messages: Message[];
    }>(),
    'messages loading failed': props<{
      error: string | null;
    }>(),
  },
});
