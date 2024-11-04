import { createSelector } from '@ngrx/store';
import { createChildSelectors } from '@onecx/ngrx-accelerator';
import {
  DataTableColumn,
  RowListGridData,
} from '@onecx/portal-integration-angular';
import { chatFeature } from '../../chat.reducers';
import { initialState } from './chat-search.reducers';
import { ChatSearchViewModel } from './chat-search.viewmodel';

export const chatSearchSelectors = createChildSelectors(
  chatFeature.selectSearch,
  initialState
);

export const selectResults = createSelector(
  chatSearchSelectors.selectResults,
  (results): RowListGridData[] => {
    return results.map((item) => ({
      imagePath: '',
      ...item,
      // ACTION S7: Here you can create a mapping of the items and their corresponding translation strings
    }));
  }
);

export const selectDisplayedColumns = createSelector(
  chatSearchSelectors.selectColumns,
  chatSearchSelectors.selectDisplayedColumns,
  (columns, displayedColumns): DataTableColumn[] => {
    return (
      (displayedColumns
        ?.map((d) => columns.find((c) => c.id === d))
        .filter((d) => d) as DataTableColumn[]) ?? []
    );
  }
);

export const selectChatSearchViewModel = createSelector(
  chatSearchSelectors.selectColumns,
  chatSearchSelectors.selectCriteria,
  selectResults,
  selectDisplayedColumns,
  chatSearchSelectors.selectViewMode,
  chatSearchSelectors.selectChartVisible,
  (
    columns,
    searchCriteria,
    results,
    displayedColumns,
    viewMode,
    chartVisible
  ): ChatSearchViewModel => ({
    columns,
    searchCriteria,
    results,
    displayedColumns,
    viewMode,
    chartVisible,
  })
);
