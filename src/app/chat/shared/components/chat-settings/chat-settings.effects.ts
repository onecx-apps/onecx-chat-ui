import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { ChatSettingsActions } from './chat-settings.actions';
import { ChatAssistantActions } from '../../../pages/chat-assistant/chat-assistant.actions';
import { selectChatSettingsState, selectChatNamePlaceholder } from './chat-settings.selectors';

@Injectable()
export class ChatSettingsEffects {
  constructor(
    private actions$: Actions,
    private store: Store
  ) {}

  submitForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatSettingsActions.formSubmitted),
      map(({ chatName, settingsType, recipientUserId, participants }) => {
        return ChatAssistantActions.chatCreateButtonClicked({
          chatName,
          chatMode: settingsType,
          recipientUserId,
          participants,
        });
      })
    )
  );

  createButtonClicked$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatSettingsActions.createButtonClicked),
      withLatestFrom(
        this.store.select(selectChatSettingsState),
        this.store.select(selectChatNamePlaceholder)
      ),
      map(([_, settings, placeholder]) => {
        const chatName = settings.chatName?.trim() || placeholder;

        return ChatSettingsActions.formSubmitted({
          chatName,
          settingsType: settings.settingsType,
          recipientUserId: settings.recipientUserId ?? undefined,
          participants: settings.participants ?? undefined,
        });
      })
    )
  );
}
