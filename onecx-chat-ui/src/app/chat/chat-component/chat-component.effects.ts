import { Injectable, SkipSelf } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ChatComponentActions } from './chat-component.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AddParticipant, ChatSearchCriteria, ChatsService, CreateChat, CreateMessage, Message, UpdateChat } from 'src/app/shared/generated';

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
              return ChatComponentActions.chatPageResultReceived({ chatPageResult: chatPageResult })
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
  );

  getParticipantsById$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ChatComponentActions.getParticipantsById),
      mergeMap((action: {chatId: string}) =>
        this.chatService.getChatParticipants(action.chatId).pipe(
          map((participants) => {
            return ChatComponentActions.getParticipantsByIdSuccess({participants: participants})
          }),
          catchError((error) =>
            of(
              ChatComponentActions.getParticipantsByIdFailed({
                error,
              })
            )
          )
        )
      )
    )
  )

  addParticipant$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ChatComponentActions.addParticipant),
      mergeMap((action: {addParticipant: AddParticipant, chatId: string}) => 
        this.chatService.addParticipant(action.chatId, action.addParticipant).pipe(
          map((participant) => {
            return ChatComponentActions.addParticipantSuccess({participant: participant})
          }),
          catchError((error) =>
            of(
              ChatComponentActions.addParticipantFailed({
                error,
              })
            )
          )
        )
      )
    )
  )

  removeParticipant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatComponentActions.removeParticipant),
      mergeMap((action: {chatId: string, participantId: string}) => 
        this.chatService.removeParticipant(action.chatId, action.participantId).pipe(
          map(() => {
            return ChatComponentActions.removeParticipantSuccess({participant: null})
          }),
          catchError((error) =>
            of(ChatComponentActions.removeParticipantFailed({
              error,
            }))
          )
        )
      )
    )
  )

  updateChat$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ChatComponentActions.updateChat),
      mergeMap((action: {chatId: string, updateChat: UpdateChat}) => 
        this.chatService.updateChat(action.chatId, action.updateChat).pipe(
          map((chat) => {
            return ChatComponentActions.updateChatSuccess({chat: chat})
          }),
          catchError((error) =>
            of(
              ChatComponentActions.updateChatFailed({
                error,
              })
            )
          )
        )
      )
    )
  )

  deleteChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatComponentActions.deleteChat),
      mergeMap((action: {chatId: string}) =>
        this.chatService.deleteChat(action.chatId).pipe(
          map(() =>{
            return ChatComponentActions.deleteChatSuccess({chat: null})
          }),
          catchError((error) =>
            of(
              ChatComponentActions.deleteChatFailed({
                error,
              })
            )
          )
        )
      )
    )  
  )
}
