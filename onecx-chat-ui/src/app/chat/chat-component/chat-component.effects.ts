import { Injectable, SkipSelf } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ChatComponentActions } from './chat-component.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ChatSearchCriteria, ChatsService, CreateChat, CreateMessage, Message } from 'src/app/shared/generated';

@Injectable()
export class ChatComponentEffects {
  constructor(
    private actions$: Actions,
    @SkipSelf() private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private chatService: ChatsService
  ) {
  }

  createChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatComponentActions.createChatClicked),
      mergeMap((action: { createChat: CreateChat }) =>
        this.chatService.createChat(action.createChat).pipe(
          map((chat) => {
              return ChatComponentActions.chatCreated({ chat: chat})
            }
          ),
          catchError((error) =>
            of(
              ChatComponentActions.chatCreationFailed({
                error
              })
            )
          )
        )
      )
    )
  );

  getChatPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatComponentActions.chatPageOpened),
      mergeMap((action: { searchCriteria: ChatSearchCriteria }) =>
        this.chatService.searchChats(action.searchCriteria).pipe(
          map((chatPageResult) => {
              return ChatComponentActions.chatPageResultReceived({ chatPageResult: chatPageResult[0] })
            }
          ),
          catchError((error) =>
            of(
              ChatComponentActions.chatPageResultLoadingFailed({
                error
              })
            )
          )
        )
      )
    )
  );

  getChatById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatComponentActions.getChatById),
      mergeMap((action: { id: string }) =>
        this.chatService.getChatById(action.id).pipe(
          map((chat) => {
              console.log("CHAT EFFECT")
              return ChatComponentActions.getChatByIdSuccess({ chat: chat })
            }
          ),
          catchError((error) =>
            of(
              ChatComponentActions.getChatByIdFailed({
                error
              })
            )
          )
        )
      )
    )
  );

  getMessagesById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatComponentActions.getMessagesById),
      mergeMap((action: { id: string }) =>
        this.chatService.getChatMessages(action.id).pipe(
          map((messages) => {
              return ChatComponentActions.getMessagesByIdSuccess({ messages: messages })
            }
          ),
          catchError((error) =>
            of(
              ChatComponentActions.getMessagesByIdFailed({
                error
              })
            )
          )
        )
      )
    )
  );

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatComponentActions.sendMessage),
      mergeMap((action: {chatId: string, createMessage: CreateMessage}) =>
        this.chatService.createChatMessage(action.chatId, action.createMessage, ).pipe(
          map((message) => {
              return(ChatComponentActions.sendMessageSuccess({message: message}))
            }
          ),
          catchError((error) =>
            of(
              ChatComponentActions.sendMessageFailed({
                error
              })
            )
          )
        )
      )
    )
  )
}
