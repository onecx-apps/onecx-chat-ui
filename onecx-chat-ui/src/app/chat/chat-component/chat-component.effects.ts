import { Injectable, SkipSelf } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { ChatComponentActions } from "./chat-component.actions";
import { mergeMap } from "rxjs";
import { ChatComponentBffService } from "src/app/shared/generated";

@Injectable()
export class ChatComponentEffects {
    constructor(
        private actions$: Actions,
        @SkipSelf() private route: ActivatedRoute,
        private router: Router,
        private store: Store,
        private chatService: ChatComponentBffService
    ) {}

    createChat$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ChatComponentActions.createchatclicked),
            mergeMap((action) => 
                this.chatService
            )
        )
    })
}