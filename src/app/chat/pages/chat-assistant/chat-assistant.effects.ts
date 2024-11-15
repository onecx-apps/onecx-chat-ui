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

  loadAvailableChats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, ChatAssistantComponent),
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
      filter(([, chat]) => chat?.id !== undefined),
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
      switchMap(() => {
        return this.createChat('123').pipe(
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
      switchMap((action) => {
        return this.createChat('123').pipe(
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

  createChat = (userId: string) => {
    return this.chatInternalService.createChat({
      type: ChatType.HumanChat,
      participants: [
        {
          type: ParticipantType.Human,
          userId,
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
        if (!chat?.id) {
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
