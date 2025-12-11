import { DataTableColumn } from '@onecx/portal-integration-angular';
import { Chat } from '../../../shared/generated';
import { chatSearchColumns } from './chat-search.columns';
import { initialState } from './chat-search.reducers';
import {
  chatSearchSelectors,
  selectResults,
  selectDisplayedColumns,
  selectChatSearchViewModel
} from './chat-search.selectors';
import { ChatSearchState } from './chat-search.state';

describe('ChatSearchSelectors', () => {
  const mockChat: Chat = {
    id: '1',
    topic: 'Test Chat',
    type: 'AI_CHAT' as any,
    participants: []
  };

  const mockChats: Chat[] = [
    {
      id: '1',
      topic: 'Chat 1',
      type: 'AI_CHAT' as any,
      participants: []
    },
    {
      id: '2',
      topic: 'Chat 2',
      type: 'HUMAN_CHAT' as any,
      participants: []
    }
  ];

  const mockColumns: DataTableColumn[] = [
    { id: 'id' } as DataTableColumn,
    { id: 'topic' } as DataTableColumn,
    { id: 'type' } as DataTableColumn,
    { id: 'participants' } as DataTableColumn
  ];

  const mockState: { chatSearch: ChatSearchState } = {
    chatSearch: {
      ...initialState,
      results: mockChats,
      columns: mockColumns,
      displayedColumns: ['id', 'topic', 'type'],
      viewMode: 'advanced',
      chartVisible: true,
      criteria: { changeMe: 'test' }
    }
  };

  describe('chatSearchSelectors', () => {
    it('should select results from state', () => {
      const result = chatSearchSelectors.selectResults(mockState);
      expect(result).toEqual(mockChats);
    });

    it('should select columns from state', () => {
      const result = chatSearchSelectors.selectColumns(mockState);
      expect(result).toEqual(mockColumns);
    });

    it('should select displayedColumns from state', () => {
      const result = chatSearchSelectors.selectDisplayedColumns(mockState);
      expect(result).toEqual(['id', 'topic', 'type']);
    });

    it('should select viewMode from state', () => {
      const result = chatSearchSelectors.selectViewMode(mockState);
      expect(result).toBe('advanced');
    });

    it('should select chartVisible from state', () => {
      const result = chatSearchSelectors.selectChartVisible(mockState);
      expect(result).toBe(true);
    });

    it('should select criteria from state', () => {
      const result = chatSearchSelectors.selectCriteria(mockState);
      expect(result).toEqual({ changeMe: 'test' });
    });

    it('should select searchLoadingIndicator from state', () => {
      const stateWithLoading = {
        chatSearch: {
          ...mockState.chatSearch,
          searchLoadingIndicator: true
        }
      };
      const result = chatSearchSelectors.selectSearchLoadingIndicator(stateWithLoading);
      expect(result).toBe(true);
    });
  });

  describe('selectResults', () => {
    it('should transform results to RowListGridData format', () => {
      const result = selectResults(mockState);

      expect(result).toEqual([
        {
          imagePath: '',
          id: '1',
          topic: 'Chat 1',
          type: 'AI_CHAT',
          participants: []
        },
        {
          imagePath: '',
          id: '2',
          topic: 'Chat 2',
          type: 'HUMAN_CHAT',
          participants: []
        }
      ]);
    });

    it('should handle empty results array', () => {
      const emptyState = {
        chatSearch: {
          ...mockState.chatSearch,
          results: []
        }
      };

      const result = selectResults(emptyState);
      expect(result).toEqual([]);
    });

    it('should return [] if results is null', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          results: null as any
        }
      };
      const result = selectResults(state);
      expect(result).toEqual([]);
    });

    it('should return [] if results is undefined', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          results: undefined as any
        }
      };
      const result = selectResults(state);
      expect(result).toEqual([]);
    });

    it('should return [] if results is not an array (object)', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          results: { foo: 'bar' } as any
        }
      };
      const result = selectResults(state);
      expect(result).toEqual([]);
    });

    it('should return [] if results is not an array (number)', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          results: 123 as any
        }
      };
      const result = selectResults(state);
      expect(result).toEqual([]);
    });

    it('should return [] if results is not an array (string)', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          results: 'not an array' as any
        }
      };
      const result = selectResults(state);
      expect(result).toEqual([]);
    });

    it('should map results array with imagePath and id defaults', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          results: [
            { id: 'x', topic: 'T1', type: 'AI_CHAT', participants: [1] },
            { id: 'y', topic: 'T2', type: 'HUMAN_CHAT', participants: [2] }
          ]
        }
      };
      const result = selectResults(state);
      expect(result).toEqual([
        { imagePath: '', id: 'x', topic: 'T1', type: 'AI_CHAT', participants: [1] },
        { imagePath: '', id: 'y', topic: 'T2', type: 'HUMAN_CHAT', participants: [2] }
      ]);
    });

    it('should handle item with undefined id using default empty string', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          results: [{ topic: 'No ID', type: 'AI_CHAT' }]
        }
      };
      const result = selectResults(state);
      expect(result[0].id).toBe('');
      expect(result[0].imagePath).toBe('');
      expect(result[0]['topic']).toBe('No ID');
      expect(result[0]['type']).toBe('AI_CHAT');
    });

    it('should handle item with null id using nullish coalescing', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          results: [{ id: null, topic: 'Null ID' } as any]
        }
      };
      const result = selectResults(state);
      // null is not replaced by ?? operator, only undefined is
      expect(result[0].id).toBe(null);
      expect(result[0].imagePath).toBe('');
    });

    it('should preserve all original properties', () => {
      const chatWithExtraProps = {
        ...mockChat,
        customProp: 'customValue',
        anotherProp: 123
      };

      const stateWithExtraProps = {
        chatSearch: {
          ...mockState.chatSearch,
          results: [chatWithExtraProps]
        }
      };

      const result = selectResults(stateWithExtraProps);
      expect(result[0]).toEqual({
        imagePath: '',
        id: '1',
        topic: 'Test Chat',
        type: 'AI_CHAT',
        participants: [],
        customProp: 'customValue',
        anotherProp: 123
      });
    });
  });

  describe('selectDisplayedColumns', () => {
    it('should return columns matching displayedColumns ids', () => {
      const result = selectDisplayedColumns(mockState);

      expect(result).toEqual([
        { id: 'id' } as DataTableColumn,
        { id: 'topic' } as DataTableColumn,
        { id: 'type' } as DataTableColumn
      ]);
    });

    it('should return empty array when columns is null', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          columns: null as any,
          displayedColumns: ['id', 'topic']
        }
      };

      const result = selectDisplayedColumns(state);
      expect(result).toEqual([]);
    });

    it('should return empty array when columns is undefined', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          columns: undefined as any,
          displayedColumns: ['id', 'topic']
        }
      };

      const result = selectDisplayedColumns(state);
      expect(result).toEqual([]);
    });

    it('should return empty array when displayedColumns is null', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          displayedColumns: null as any
        }
      };

      const result = selectDisplayedColumns(state);
      expect(result).toEqual([]);
    });

    it('should return empty array when displayedColumns is undefined', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          displayedColumns: undefined as any
        }
      };

      const result = selectDisplayedColumns(state);
      expect(result).toEqual([]);
    });

    it('should return empty array when displayedColumns is empty', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          columns: mockColumns,
          displayedColumns: []
        }
      };

      const result = selectDisplayedColumns(state);
      expect(result).toEqual([]);
    });

    it('should return [] if columns is not an array (object)', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          columns: { foo: 'bar' } as any,
          displayedColumns: ['id', 'topic']
        }
      };
      const result = selectDisplayedColumns(state);
      expect(result).toEqual([]);
    });

    it('should return [] if columns is not an array (number)', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          columns: 123 as any,
          displayedColumns: ['id', 'topic']
        }
      };
      const result = selectDisplayedColumns(state);
      expect(result).toEqual([]);
    });

    it('should return [] if displayedColumns is not an array (object)', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          columns: mockColumns,
          displayedColumns: { foo: 'bar' } as any
        }
      };
      const result = selectDisplayedColumns(state);
      expect(result).toEqual([]);
    });

    it('should return [] if displayedColumns is not an array (string)', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          columns: mockColumns,
          displayedColumns: 'not-an-array' as any
        }
      };
      const result = selectDisplayedColumns(state);
      expect(result).toEqual([]);
    });

    it('should map displayedColumns to matching columns using columns.find', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          columns: mockColumns,
          displayedColumns: ['id', 'topic', 'type']
        }
      };
      const result = selectDisplayedColumns(state);
      expect(result).toEqual([
        { id: 'id' } as DataTableColumn,
        { id: 'topic' } as DataTableColumn,
        { id: 'type' } as DataTableColumn
      ]);
      expect(result.length).toBe(3);
    });

    it('should filter out displayedColumns that do not match any column id', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          columns: mockColumns,
          displayedColumns: ['id', 'nonexistent', 'topic', 'missing']
        }
      };
      const result = selectDisplayedColumns(state);
      expect(result).toEqual([
        { id: 'id' } as DataTableColumn,
        { id: 'topic' } as DataTableColumn
      ]);
      expect(result.length).toBe(2);
    });

    it('should handle columns with null id', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          columns: [
            { id: 'id' } as DataTableColumn,
            { id: null } as any,
            { id: 'topic' } as DataTableColumn
          ],
          displayedColumns: ['id', 'topic']
        }
      };
      const result = selectDisplayedColumns(state);
      expect(result.length).toBe(2);
      expect(result).toEqual([
        { id: 'id' } as DataTableColumn,
        { id: 'topic' } as DataTableColumn
      ]);
    });

    it('should handle columns with undefined id', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          columns: [
            { id: 'id' } as DataTableColumn,
            { id: undefined } as any,
            { id: 'topic' } as DataTableColumn
          ],
          displayedColumns: ['id', 'topic']
        }
      };
      const result = selectDisplayedColumns(state);
      expect(result.length).toBe(2);
      expect(result).toEqual([
        { id: 'id' } as DataTableColumn,
        { id: 'topic' } as DataTableColumn
      ]);
    });

    it('should handle empty columns array', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          columns: [],
          displayedColumns: ['id', 'topic']
        }
      };

      const result = selectDisplayedColumns(state);
      expect(result).toEqual([]);
    });

    it('should return empty array when all displayedColumns are filtered out', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          columns: mockColumns,
          displayedColumns: ['nonexistent1', 'nonexistent2', 'nonexistent3']
        }
      };

      const result = selectDisplayedColumns(state);
      // This tests the ?? [] operator, although filter(Boolean) always returns an array
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('selectChatSearchViewModel', () => {
    it('should create complete view model', () => {
      const result = selectChatSearchViewModel(mockState);
      
      expect(result).toEqual({
        columns: mockColumns,
        searchCriteria: { changeMe: 'test' },
        results: [
          {
            imagePath: '',
            id: '1',
            topic: 'Chat 1',
            type: 'AI_CHAT',
            participants: []
          },
          {
            imagePath: '',
            id: '2',
            topic: 'Chat 2',
            type: 'HUMAN_CHAT',
            participants: []
          }
        ],
        displayedColumns: [
          { id: 'id' } as DataTableColumn,
          { id: 'topic' } as DataTableColumn,
          { id: 'type' } as DataTableColumn
        ],
        viewMode: 'advanced',
        chartVisible: true
      });
    });

    it('should handle initial state', () => {
      const initialMockState = {
        chatSearch: {
          ...initialState,
          columns: chatSearchColumns
        }
      };
      const result = selectChatSearchViewModel(initialMockState);
      
      expect(result.results).toEqual([]);
      expect(result.displayedColumns).toEqual([]);
      expect(result.columns).toEqual(chatSearchColumns);
    });

    it('should handle basic view mode', () => {
      const basicModeState = {
        chatSearch: {
          ...mockState.chatSearch,
          viewMode: 'basic' as const,
          chartVisible: false
        }
      };
      const result = selectChatSearchViewModel(basicModeState);
      
      expect(result.viewMode).toBe('basic');
      expect(result.chartVisible).toBe(false);
    });

    it('should handle empty criteria', () => {
      const emptyCriteriaState = {
        chatSearch: {
          ...mockState.chatSearch,
          criteria: {}
        }
      };
      const result = selectChatSearchViewModel(emptyCriteriaState);
      
      expect(result.searchCriteria).toEqual({});
    });

    it('should handle null displayedColumns in view model', () => {
      const nullDisplayedState = {
        chatSearch: {
          ...mockState.chatSearch,
          displayedColumns: null as any
        }
      };

      const result = selectChatSearchViewModel(nullDisplayedState);
      expect(result.displayedColumns).toEqual([]);
    });

    it('should handle null results in view model', () => {
      const nullResultsState = {
        chatSearch: {
          ...mockState.chatSearch,
          results: null as any
        }
      };

      const result = selectChatSearchViewModel(nullResultsState);
      expect(result.results).toEqual([]);
    });
  });

  describe('selector memoization', () => {
    it('should return same reference when input state unchanged', () => {
      const result1 = selectResults(mockState);
      const result2 = selectResults(mockState);

      expect(result1).toBe(result2);
    });

    it('should return new reference when results change', () => {
      const result1 = selectResults(mockState);
      
      const modifiedState = {
        chatSearch: {
          ...mockState.chatSearch,
          results: [...mockState.chatSearch.results, mockChat]
        }
      };
      const result2 = selectResults(modifiedState);

      expect(result1).not.toBe(result2);
      expect(result1.length).toBe(2);
      expect(result2.length).toBe(3);
    });

    it('should return same displayedColumns reference when columns and displayedColumns unchanged', () => {
      const result1 = selectDisplayedColumns(mockState);
      const result2 = selectDisplayedColumns(mockState);

      expect(result1).toBe(result2);
    });

    it('should return new displayedColumns when columns change', () => {
      const result1 = selectDisplayedColumns(mockState);
      
      const modifiedState = {
        chatSearch: {
          ...mockState.chatSearch,
          columns: [...mockColumns, { id: 'newColumn' } as DataTableColumn]
        }
      };
      const result2 = selectDisplayedColumns(modifiedState);

      expect(result1).not.toBe(result2);
    });

    it('should return same view model reference when all dependencies unchanged', () => {
      const result1 = selectChatSearchViewModel(mockState);
      const result2 = selectChatSearchViewModel(mockState);

      expect(result1).toBe(result2);
    });

    it('should return new view model when any dependency changes', () => {
      const result1 = selectChatSearchViewModel(mockState);
      
      const modifiedState = {
        chatSearch: {
          ...mockState.chatSearch,
          chartVisible: false
        }
      };
      const result2 = selectChatSearchViewModel(modifiedState);

      expect(result1).not.toBe(result2);
      expect(result2.chartVisible).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle results with mixed valid and invalid data', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          results: [
            { id: '1', topic: 'Valid' },
            null,
            { id: '2', topic: 'Also Valid' },
            undefined
          ] as any
        }
      };

      const result = selectResults(state);
      expect(result.length).toBe(4);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('');
      expect(result[2].id).toBe('2');
      expect(result[3].id).toBe('');
    });

    it('should handle displayedColumns with duplicate ids', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          columns: mockColumns,
          displayedColumns: ['id', 'id', 'topic', 'topic']
        }
      };

      const result = selectDisplayedColumns(state);
      expect(result.length).toBe(4);
      expect(result[0].id).toBe('id');
      expect(result[1].id).toBe('id');
    });

    it('should handle columns array with null elements', () => {
      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          columns: [null, { id: 'id' }, null, { id: 'topic' }] as any,
          displayedColumns: ['id', 'topic']
        }
      };

      const result = selectDisplayedColumns(state);
      expect(result.length).toBe(2);
    });

    it('should handle very large results array', () => {
      const largeResults = Array.from({ length: 1000 }, (_, i) => ({
        id: `id-${i}`,
        topic: `Topic ${i}`,
        type: 'AI_CHAT'
      }));

      const state = {
        chatSearch: {
          ...mockState.chatSearch,
          results: largeResults
        }
      };

      const result = selectResults(state);
      expect(result.length).toBe(1000);
      expect(result[0].id).toBe('id-0');
      expect(result[999].id).toBe('id-999');
    });
  });
});
