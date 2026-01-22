import { RowListGridData } from '@onecx/portal-integration-angular';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { isValidDate } from '@onecx/accelerator';
import {
  Action,
  BreadcrumbService,
  DataTableColumn,
  enumToDropdownOptions,
  ExportDataService,
} from '@onecx/portal-integration-angular';
import { PrimeIcons } from 'primeng/api';
import { map, Observable, of } from 'rxjs';
import { ChatSearchActions } from './chat-search.actions';
import {
  ChatSearchCriteria,
  chatSearchCriteriasSchema,
} from './chat-search.parameters';
import { selectChatSearchViewModel } from './chat-search.selectors';
import { ChatSearchViewModel } from './chat-search.viewmodel';
import { ChatType } from 'src/app/shared/generated';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chat-search',
  templateUrl: './chat-search.component.html',
  styleUrls: ['./chat-search.component.scss'],
})
export class ChatSearchComponent implements OnInit {
  viewModel$: Observable<ChatSearchViewModel> = this.store.select(
    selectChatSearchViewModel,
  );

  // ACTION S10: Update header actions
  headerActions$: Observable<Action[]> = this.viewModel$.pipe(
    map((vm) => {
      const actions: Action[] = [
        {
          labelKey: 'CHAT_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          icon: PrimeIcons.DOWNLOAD,
          titleKey: 'CHAT_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          show: 'asOverflow',
          actionCallback: () => this.exportItems(),
        },
        {
          labelKey: vm.chartVisible
            ? 'CHAT_SEARCH.HEADER_ACTIONS.HIDE_CHART'
            : 'CHAT_SEARCH.HEADER_ACTIONS.SHOW_CHART',
          icon: PrimeIcons.EYE,
          titleKey: vm.chartVisible
            ? 'CHAT_SEARCH.HEADER_ACTIONS.HIDE_CHART'
            : 'CHAT_SEARCH.HEADER_ACTIONS.SHOW_CHART',
          show: 'asOverflow',
          actionCallback: () => this.toggleChartVisibility(),
        },
      ];
      return actions;
    }),
  );

  // ACTION S9: Please select the column to be displayed in the diagram
  diagramColumnId = 'id';
  diagramColumn$ = this.viewModel$.pipe(
    map(
      (vm) =>
        vm.columns.find(
          (e) => e.id === this.diagramColumnId,
        ) as DataTableColumn,
    ),
  );

  public chatSearchFormGroup: FormGroup = this.formBuilder.group({
    ...(Object.fromEntries(
      chatSearchCriteriasSchema.keyof().options.map((k) => [k, null]),
    ) as Record<keyof ChatSearchCriteria, unknown>),
  } satisfies Record<keyof ChatSearchCriteria, unknown>);

  type$ = enumToDropdownOptions(
    this.translateService,
    ChatType,
    'CHAT_SEARCH.CRITERIA.TYPE.',
  );

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
    @Inject(LOCALE_ID) public readonly locale: string,
    private readonly translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.breadcrumbService.setItems([
      {
        titleKey: 'CHAT_SEARCH.BREADCRUMB',
        labelKey: 'CHAT_SEARCH.BREADCRUMB',
        routerLink: '/chat',
      },
    ]);
    this.viewModel$.subscribe((vm) =>
      this.chatSearchFormGroup.patchValue(vm.searchCriteria),
    );
  }

  search(formValue: FormGroup) {
    const searchCriteria = Object.entries(formValue.getRawValue()).reduce(
      (acc: Partial<ChatSearchCriteria>, [key, value]) => ({
        ...acc,
        [key]: isValidDate(value)
          ? new Date(
              Date.UTC(
                value.getFullYear(),
                value.getMonth(),
                value.getDate(),
                value.getHours(),
                value.getMinutes(),
                value.getSeconds(),
              ),
            )
          : value || undefined,
      }),
      {},
    );
    this.store.dispatch(
      ChatSearchActions.searchButtonClicked({ searchCriteria }),
    );
  }

  details({ id }: RowListGridData) {
    this.store.dispatch(ChatSearchActions.detailsButtonClicked({ id }));
  }

  resetSearch() {
    this.store.dispatch(ChatSearchActions.resetButtonClicked());
  }

  exportItems() {
    this.store.dispatch(ChatSearchActions.exportButtonClicked());
  }

  viewModeChanged(viewMode: 'basic' | 'advanced') {
    this.store.dispatch(
      ChatSearchActions.viewModeChanged({
        viewMode: viewMode,
      }),
    );
  }

  onDisplayedColumnsChange(displayedColumns: DataTableColumn[]) {
    this.store.dispatch(
      ChatSearchActions.displayedColumnsChanged({ displayedColumns }),
    );
  }

  toggleChartVisibility() {
    this.store.dispatch(ChatSearchActions.chartVisibilityToggled());
  }
}
