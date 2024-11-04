import { Injectable, SkipSelf } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';
import {
  filterForNavigatedTo,
  filterOutOnlyQueryParamsChanged,
  filterOutQueryParamsHaveNotChanged,
} from '@onecx/ngrx-accelerator';
import {
  ExportDataService,
  PortalMessageService,
} from '@onecx/portal-integration-angular';
import equal from 'fast-deep-equal';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ChatBffService } from '../../../shared/generated';
import { ChatSearchActions } from './chat-search.actions';
import { ChatSearchComponent } from './chat-search.component';
import { chatSearchCriteriasSchema } from './chat-search.parameters';
import {
  chatSearchSelectors,
  selectChatSearchViewModel,
} from './chat-search.selectors';

@Injectable()
export class ChatSearchEffects {
  constructor(
    private actions$: Actions,
    @SkipSelf() private route: ActivatedRoute,
    private chatService: ChatBffService,
    private router: Router,
    private store: Store,
    private messageService: PortalMessageService,
    private readonly exportDataService: ExportDataService
  ) {}

  syncParamsToUrl$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          ChatSearchActions.searchButtonClicked,
          ChatSearchActions.resetButtonClicked
        ),
        concatLatestFrom(() => [
          this.store.select(chatSearchSelectors.selectCriteria),
          this.route.queryParams,
        ]),
        tap(([, criteria, queryParams]) => {
          const results = chatSearchCriteriasSchema.safeParse(queryParams);
          if (!results.success || !equal(criteria, results.data)) {
            const params = {
              ...criteria,
              //TODO: Move to docs to explain how to only put the date part in the URL in case you have date and not datetime
              //exampleDate: criteria.exampleDate?.toISOString()?.slice(0, 10)
            };
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: params,
              replaceUrl: true,
              onSameUrlNavigation: 'ignore',
            });
          }
        })
      );
    },
    { dispatch: false }
  );

  searchByUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, ChatSearchComponent),
      filterOutQueryParamsHaveNotChanged(
        this.router,
        chatSearchCriteriasSchema,
        false
      ),
      concatLatestFrom(() =>
        this.store.select(chatSearchSelectors.selectCriteria)
      ),
      switchMap(([, searchCriteria]) => this.performSearch(searchCriteria))
    );
  });

  performSearch(searchCriteria: Record<string, any>) {
    return this.chatService
      .searchChats({
        ...Object.entries(searchCriteria).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: value instanceof Date ? value.toISOString() : value,
          }),
          {}
        ),
      })
      .pipe(
        map(({ results, totalNumberOfResults }) =>
          ChatSearchActions.chatSearchResultsReceived({
            results,
            totalNumberOfResults,
          })
        ),
        catchError((error) =>
          of(
            ChatSearchActions.chatSearchResultsLoadingFailed({
              error,
            })
          )
        )
      );
  }

  rehydrateChartVisibility$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, ChatSearchComponent),
      filterOutOnlyQueryParamsChanged(this.router),
      map(() =>
        ChatSearchActions.chartVisibilityRehydrated({
          visible: localStorage.getItem('chatChartVisibility') === 'true',
        })
      )
    );
  });

  saveChartVisibility$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ChatSearchActions.chartVisibilityToggled),
        concatLatestFrom(() =>
          this.store.select(chatSearchSelectors.selectChartVisible)
        ),
        tap(([, chartVisible]) => {
          localStorage.setItem('chatChartVisibility', String(chartVisible));
        })
      );
    },
    { dispatch: false }
  );

  exportData$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ChatSearchActions.chartVisibilityToggled),
        concatLatestFrom(() => this.store.select(selectChatSearchViewModel)),
        map(([, viewModel]) => {
          this.exportDataService.exportCsv(
            viewModel.displayedColumns,
            viewModel.results,
            'Chat.csv'
          );
        })
      );
    },
    { dispatch: false }
  );

  errorMessages: { action: Action; key: string }[] = [
    {
      action: ChatSearchActions.chatSearchResultsLoadingFailed,
      key: 'CHAT_SEARCH.ERROR_MESSAGES.SEARCH_RESULTS_LOADING_FAILED',
    },
  ];

  displayError$ = createEffect(
    () => {
      return this.actions$.pipe(
        tap((action) => {
          const e = this.errorMessages.find(
            (e) => e.action.type === action.type
          );
          if (e) {
            this.messageService.error({ summaryKey: e.key });
          }
        })
      );
    },
    { dispatch: false }
  );
}
