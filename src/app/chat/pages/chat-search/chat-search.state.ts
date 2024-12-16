import { DataTableColumn } from '@onecx/portal-integration-angular';
import { Chat } from 'src/app/shared/generated';
import { ChatSearchCriteria } from './chat-search.parameters';

export interface ChatSearchState {
  columns: DataTableColumn[];
  results: Chat[];
  displayedColumns: string[] | null;
  viewMode: 'basic' | 'advanced';
  chartVisible: boolean;
  searchLoadingIndicator: boolean;
  criteria: ChatSearchCriteria;
}
