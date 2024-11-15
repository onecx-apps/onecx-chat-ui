import { Injectable, SkipSelf } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filterForNavigatedTo } from '@onecx/ngrx-accelerator';
import {
  ExportDataService,
  PortalMessageService,
} from '@onecx/portal-integration-angular';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import {
  ChatBffService,
  ChatsInternal,
  ChatType,
  MessageType,
  ParticipantType,
} from '../../../shared/generated';
import { ChatAssistantActions } from './chat-assistant.actions';
import { ChatAssistantComponent } from './chat-assistant.component';
import { chatAssistantSelectors } from './chat-assistant.selectors';
import { ChatUser } from './chat-assistant.state';

@Injectable()
export class ChatAssistantEffects {
  constructor(
    private actions$: Actions,
    @SkipSelf() private route: ActivatedRoute,
    private chatService: ChatBffService,
    private chatInternalService: ChatsInternal,
    private router: Router,
    private store: Store,
    private messageService: PortalMessageService,
    private readonly exportDataService: ExportDataService
  ) {}

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
        ChatAssistantActions.chatCreationSuccessfull,
        ChatAssistantActions.messageSentForNewChat
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
        ChatAssistantActions.messageSendingSuccessfull,
        ChatAssistantActions.messagesLoadingFailed
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

  createChat$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatAssistantActions.chatCreated),
      concatLatestFrom(() => [
        this.store.select(chatAssistantSelectors.selectUser),
      ]),
      filter(([, user]) => user !== undefined),
      switchMap(([, user]) => {
        return this.createChat(user as ChatUser).pipe(
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
      ]),
      filter(([, user]) => user !== undefined),
      switchMap(([action, user]) => {
        return this.createChat(user as ChatUser).pipe(
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

  createChat = (user: ChatUser) => {
    return this.chatInternalService.createChat({
      type: ChatType.AiChat,
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
                  error,
                })
              )
            )
          );
      })
    );
  });
}
