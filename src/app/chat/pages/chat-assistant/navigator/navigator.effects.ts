import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { NavigatorActions } from './navigator.actions';


@Injectable()
export class NavigatorEffects {
  constructor(private actions$: Actions) {}

  backFromChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavigatorActions.backFromChat),
      map(() => NavigatorActions.navigateToChatList())
    )
  );
}
