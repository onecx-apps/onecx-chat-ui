import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';
import { filterForNavigatedTo } from '@onecx/ngrx-accelerator';
import { PortalMessageService } from '@onecx/portal-integration-angular';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import {
  ChatsInternal,
  ChatType,
  MessageType,
  ParticipantType,
} from '../../../shared/generated';
import { ChatAssistantActions } from './chat-assistant.actions';
import { ChatAssistantComponent } from './chat-assistant.component';
import { chatAssistantSelectors } from './chat-assistant.selectors';
import { ChatUser } from './chat-assistant.state';
import { ChatInternalService } from 'src/app/remotes/chat-panel/chat-panel.component.bootstrap';

const CHAT_TOPIC_LENGTH = 30;

@Injectable()
export class ChatAssistantEffects {
  constructor(
    private actions$: Actions,
    private _remoteChatInternalService: ChatInternalService,
    private _chatInternalService: ChatsInternal,
    private router: Router,
    private store: Store,
    private messageService: PortalMessageService
  ) {}

  get chatInternalService() {
    return (
      this._remoteChatInternalService.getService() ?? this._chatInternalService
    );
  }

  navigatedToChatAssistant = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, ChatAssistantComponent),
      switchMap(() => {
        return of(ChatAssistantActions.navigatedToChatAssistant());
      })
    );
  });

  loadAvailableChats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ChatAssistantActions.navigatedToChatAssistant,
        ChatAssistantActions.chatPanelOpened,
        ChatAssistantActions.chatCreationSuccessfull,
        ChatAssistantActions.messageSentForNewChat,
        ChatAssistantActions.chatDeletionSuccessfull,
        ChatAssistantActions.chatDeletionFailed
      ),
      switchMap(() => {
        return this.chatInternalService.getChats().pipe(
          map((response) => {
            return ChatAssistantActions.chatsLoaded({
              chats: response.stream ?? [],
            });
          }),
          catchError((error) =>
            of(
              ChatAssistantActions.chatsLoadingFailed({
                error,
              })
            )
          )
        );
      })
    );
  });

  loadAvailableMessages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ChatAssistantActions.chatSelected,
        ChatAssistantActions.messageSendingSuccessfull
      ),
      concatLatestFrom(() => [
        this.store.select(chatAssistantSelectors.selectCurrentChat),
      ]),
      filter(([, chat]) => chat?.id !== undefined && chat.id !== 'new'),
      switchMap(([, chat]) => {
        return this.chatInternalService.getChatMessages(chat?.id ?? '').pipe(
          map((response) => {
            return ChatAssistantActions.messagesLoaded({
              messages: response,
            });
          }),
          catchError((error) =>
            of(
              ChatAssistantActions.messagesLoadingFailed({
                error,
              })
            )
          )
        );
      })
    );
  });

  deleteChat$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatAssistantActions.currentChatDeleted),
      concatLatestFrom(() => [
        this.store.select(chatAssistantSelectors.selectCurrentChat),
      ]),
      filter(([, chat]) => chat?.id !== undefined && chat.id !== 'new'),
      switchMap(([, chat]) => {
        return this.chatInternalService.deleteChat(chat?.id ?? '').pipe(
          map(() => {
            return ChatAssistantActions.chatDeletionSuccessfull({
              chatId: chat?.id ?? '',
            });
          }),
          catchError((error) =>
            of(
              ChatAssistantActions.chatDeletionFailed({
                error,
              })
            )
          )
        );
      })
    );
  });

  updateChatTopic$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatAssistantActions.updateCurrentChatTopic),
      concatLatestFrom(() => [
        this.store.select(chatAssistantSelectors.selectCurrentChat),
      ]),
      filter(([, chat]) => chat?.id !== undefined && chat.id !== 'new'),
      switchMap(([action, chat]) => {
        return this.chatInternalService
          .updateChat(chat?.id ?? '', {
            topic: action.topic,
          })
          .pipe(
            map(() => {
              return ChatAssistantActions.chatDeletionSuccessfull({
                chatId: chat?.id ?? '',
              });
            }),
            catchError((error) =>
              of(
                ChatAssistantActions.chatDeletionFailed({
                  error,
                })
              )
            )
          );
      })
    );
  });

  createChat$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatAssistantActions.chatCreated),
      concatLatestFrom(() => [
        this.store.select(chatAssistantSelectors.selectUser),
        this.store.select(chatAssistantSelectors.selectTopic),
      ]),
      filter(([, user]) => user !== undefined),
      switchMap(([, user, topic]) => {
        return this.createChat(user as ChatUser, topic).pipe(
          map((chat) => {
            return ChatAssistantActions.chatCreationSuccessfull({
              chat,
            });
          }),
          catchError((error) =>
            of(
              ChatAssistantActions.chatCreationFailed({
                error,
              })
            )
          )
        );
      })
    );
  });

  createChatAndSendMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatAssistantActions.createNewChatForMessage),
      concatLatestFrom(() => [
        this.store.select(chatAssistantSelectors.selectUser),
        this.store.select(chatAssistantSelectors.selectTopic),
      ]),
      filter(([, user]) => user !== undefined),
      switchMap(([action, user, topic]) => {
        const messageExtract =
          action.message.length > CHAT_TOPIC_LENGTH
            ? action.message.substring(0, CHAT_TOPIC_LENGTH)
            : action.message;
        const chatTopic = `${topic}: ${messageExtract}...`;
        return this.createChat(user as ChatUser, chatTopic).pipe(
          map((chat) =>
            ChatAssistantActions.messageSentForNewChat({
              chat,
              message: action.message,
            })
          ),
          catchError((error) =>
            of(
              ChatAssistantActions.chatCreationFailed({
                error,
              })
            )
          )
        );
      })
    );
  });

  createChat = (user: ChatUser, topic: string) => {
    return this.chatInternalService.createChat({
      type: ChatType.AiChat,
      topic: topic,
      participants: [
        {
          type: ParticipantType.Human,
          userId: user.userId,
          userName: user.userName,
          email: user.email,
        },
      ],
    });
  };

  sendMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ChatAssistantActions.messageSent,
        ChatAssistantActions.messageSentForNewChat
      ),
      concatLatestFrom(() => [
        this.store.select(chatAssistantSelectors.selectCurrentChat),
      ]),
      switchMap(([action, chat]) => {
        if (!chat?.id || chat.id === 'new') {
          return of(
            ChatAssistantActions.createNewChatForMessage({
              message: action.message,
            })
          );
        }
        return this.chatInternalService
          .createChatMessage(chat.id, {
            type: MessageType.Human,
            text: action.message,
          })
          .pipe(
            map((message) =>
              ChatAssistantActions.messageSendingSuccessfull({
                message,
              })
            ),
            catchError((error) =>
              of(
                ChatAssistantActions.messageSendingFailed({
                  message: action.message,
                  error,
                })
              )
            )
          );
      })
    );
  });

  // errorMessages: { action: Action; key: string }[] = [
  //   {
  //     action: ChatAssistantActions.chatCreationFailed,
  //     key: 'CHAT.ERROR_MESSAGES.CREATE_CHAT',
  //   },
  //   {
  //     action: ChatAssistantActions.chatDeletionFailed,
  //     key: 'CHAT.ERROR_MESSAGES.DELETE_CHAT',
  //   },
  //   {
  //     action: ChatAssistantActions.messageSendingFailed,
  //     key: 'CHAT.ERROR_MESSAGES.SEND_MESSAGE',
  //   },
  // ];

  // successMessages: { action: Action; key: string }[] = [
  //   {
  //     action: ChatAssistantActions.chatCreationSuccessfull,
  //     key: 'CHAT.SUCCESS_MESSAGES.CREATE_CHAT',
  //   },
  // ];

  // displayError$ = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       tap((action) => {
  //         const e = this.errorMessages.find(
  //           (e) => e.action.type === action.type
  //         );
  //         if (e) {
  //           this.messageService.error({ summaryKey: e.key });
  //         }
  //       })
  //     );
  //   },
  //   { dispatch: false }
  // );

  // displaySuccess$ = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       tap((action) => {
  //         const e = this.successMessages.find(
  //           (e) => e.action.type === action.type
  //         );
  //         if (e) {
  //           this.messageService.success({ summaryKey: e.key });
  //         }
  //       })
  //     );
  //   },
  //   { dispatch: false }
  // );
}
