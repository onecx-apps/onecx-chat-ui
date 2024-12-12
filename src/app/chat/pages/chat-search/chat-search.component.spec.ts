import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { ofType } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  BreadcrumbService,
  ColumnType,
  PortalCoreModule,
  UserService,
} from '@onecx/portal-integration-angular';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { DialogService } from 'primeng/dynamicdialog';
import { ChatSearchActions } from './chat-search.actions';
import { chatSearchColumns } from './chat-search.columns';
import { ChatSearchComponent } from './chat-search.component';
import { ChatSearchHarness } from './chat-search.harness';
import { initialState } from './chat-search.reducers';
import { selectChatSearchViewModel } from './chat-search.selectors';
import { ChatSearchViewModel } from './chat-search.viewmodel';

describe('ChatSearchComponent', () => {
  const origAddEventListener = window.addEventListener;
  const origPostMessage = window.postMessage;

  let listeners: any[] = [];
  window.addEventListener = (_type: any, listener: any) => {
    listeners.push(listener);
  };

  window.removeEventListener = (_type: any, listener: any) => {
    listeners = listeners.filter((l) => l !== listener);
  };

  window.postMessage = (m: any) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    listeners.forEach((l) =>
      l({
        data: m,
        stopImmediatePropagation: () => {},
        stopPropagation: () => {},
      })
    );
  };

  afterAll(() => {
    window.addEventListener = origAddEventListener;
    window.postMessage = origPostMessage;
  });

  HTMLCanvasElement.prototype.getContext = jest.fn();
  let component: ChatSearchComponent;
  let fixture: ComponentFixture<ChatSearchComponent>;
  let store: MockStore<Store>;
  let formBuilder: FormBuilder;
  let chatSearch: ChatSearchHarness;

  const mockActivatedRoute = {
    snapshot: {
      data: {},
    },
  };
  const baseChatSearchViewModel: ChatSearchViewModel = {
    columns: chatSearchColumns,
    searchCriteria: { changeMe: '0' },
    results: [],
    displayedColumns: [],
    viewMode: 'basic',
    chartVisible: false,
  };

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatSearchComponent],
      imports: [
        PortalCoreModule,
        LetDirective,
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        TranslateTestingModule.withTranslations(
          'en',
          require('./../../../../assets/i18n/en.json')
        ).withTranslations('de', require('./../../../../assets/i18n/de.json')),
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        DialogService,
        provideMockStore({
          initialState: { chat: { search: initialState } },
        }),
        FormBuilder,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    const mutationObserverMock = jest.fn(function MutationObserver(callback) {
      this.observe = jest.fn()
      this.disconnect = jest.fn()
      this.trigger = (mockedMutationsList: any) => {
        callback(mockedMutationsList, this)
      }
      return this
    })
    global.MutationObserver = mutationObserverMock
    global.origin = "";
  });

  beforeEach(async () => {
    const userService = TestBed.inject(UserService);
    userService.hasPermission = () => true;
    const translateService = TestBed.inject(TranslateService);
    translateService.use('en');
    formBuilder = TestBed.inject(FormBuilder);

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectChatSearchViewModel, baseChatSearchViewModel);
    store.refreshState();

    fixture = TestBed.createComponent(ChatSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    chatSearch = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      ChatSearchHarness
    );
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch resetButtonClicked action on resetSearch', async () => {
    var doneFn = jest.fn();
    store.overrideSelector(selectChatSearchViewModel, {
      ...baseChatSearchViewModel,
      results: [
        {
          id: '1',
          imagePath: '',
          column_1: 'val_1',
        },
      ],
      columns: [
        {
          columnType: ColumnType.STRING,
          nameKey: 'COLUMN_KEY',
          id: 'column_1',
        },
      ],
    });
    store.refreshState();

    store.scannedActions$
      .pipe(ofType(ChatSearchActions.resetButtonClicked))
      .subscribe(() => {
        doneFn();
      });

    const searchHeader = await chatSearch.getHeader();
    await searchHeader.clickResetButton();
    expect(doneFn).toHaveBeenCalledTimes(1);
  });

  it('should have 2 overFlow header actions when search config is disabled', async () => {
    const searchHeader = await chatSearch.getHeader();
    const pageHeader = await searchHeader.getPageHeader();
    const overflowActionButton = await pageHeader.getOverflowActionMenuButton();
    await overflowActionButton?.click();

    const overflowMenuItems = await pageHeader.getOverFlowMenuItems();
    expect(overflowMenuItems.length).toBe(2);

    const exportAllActionItem = await pageHeader.getOverFlowMenuItem(
      'Export all'
    );
    expect(await exportAllActionItem!.getText()).toBe('Export all');

    const showHideChartActionItem = await pageHeader.getOverFlowMenuItem(
      'Show chart'
    );
    expect(await showHideChartActionItem!.getText()).toBe('Show chart');
  });

  it('should display hide chart action if chart is visible', async () => {
    store.overrideSelector(selectChatSearchViewModel, {
      ...baseChatSearchViewModel,
      chartVisible: true,
    });
    store.refreshState();

    const searchHeader = await chatSearch.getHeader();
    const pageHeader = await searchHeader.getPageHeader();
    const overflowActionButton = await pageHeader.getOverflowActionMenuButton();
    await overflowActionButton?.click();

    const overflowMenuItems = await pageHeader.getOverFlowMenuItems();
    expect(overflowMenuItems.length).toBe(2);

    const showHideChartActionItem = await pageHeader.getOverFlowMenuItem(
      'Hide chart'
    );
    expect(await showHideChartActionItem!.getText()).toEqual('Hide chart');
  });

  it('should display chosen column in the diagram', async () => {
    component.diagramColumnId = 'column_1';
    store.overrideSelector(selectChatSearchViewModel, {
      ...baseChatSearchViewModel,
      chartVisible: true,
      results: [
        {
          id: '1',
          imagePath: '',
          column_1: 'val_1',
        },
        {
          id: '2',
          imagePath: '',
          column_1: 'val_2',
        },
        {
          id: '3',
          imagePath: '',
          column_1: 'val_2',
        },
      ],
      columns: [
        {
          columnType: ColumnType.STRING,
          nameKey: 'COLUMN_KEY',
          id: 'column_1',
        },
      ],
    });
    store.refreshState();

    const diagram = await (await chatSearch.getDiagram())!.getDiagram();

    expect(await diagram.getTotalNumberOfResults()).toBe(3);
    expect(await diagram.getSumLabel()).toEqual('Total');
  });

  it('should display correct breadcrumbs', async () => {
    const breadcrumbService = TestBed.inject(BreadcrumbService);
    jest.spyOn(breadcrumbService, 'setItems');

    component.ngOnInit();
    fixture.detectChanges();

    expect(breadcrumbService.setItems).toHaveBeenCalledTimes(1);
    const searchHeader = await chatSearch.getHeader();
    const pageHeader = await searchHeader.getPageHeader();
    const searchBreadcrumbItem = await pageHeader.getBreadcrumbItem('Search');

    expect(await searchBreadcrumbItem!.getText()).toEqual('Search');
  });

  it('should dispatch searchButtonClicked action on search', (done) => {
    const formValue = formBuilder.group({
      changeMe: '123',
    });
    component.chatSearchFormGroup = formValue;

    store.scannedActions$
      .pipe(ofType(ChatSearchActions.searchButtonClicked))
      .subscribe((a) => {
        expect(a.searchCriteria).toEqual({ changeMe: '123' });
        done();
      });

    component.search(formValue);
  });

  it('should dispatch export csv data on export action click', async () => {
    jest.spyOn(store, 'dispatch');

    const results = [
      {
        id: '1',
        imagePath: '',
        column_1: 'val_1',
      },
    ];
    const columns = [
      {
        columnType: ColumnType.STRING,
        nameKey: 'COLUMN_KEY',
        id: 'column_1',
      },
    ];
    store.overrideSelector(selectChatSearchViewModel, {
      ...baseChatSearchViewModel,
      results: results,
      columns: columns,
      displayedColumns: columns,
    });
    store.refreshState();

    const searchHeader = await chatSearch.getHeader();
    const pageHeader = await searchHeader.getPageHeader();
    const overflowActionButton = await pageHeader.getOverflowActionMenuButton();
    await overflowActionButton?.click();

    const exportAllActionItem = await pageHeader.getOverFlowMenuItem(
      'Export all'
    );
    await exportAllActionItem!.selectItem();

    expect(store.dispatch).toHaveBeenCalledWith(
      ChatSearchActions.exportButtonClicked()
    );
  });

  it('should dispatch viewModeChanged action on view mode changes', async () => {
    jest.spyOn(store, 'dispatch');

    component.viewModeChanged('advanced');

    expect(store.dispatch).toHaveBeenCalledWith(
      ChatSearchActions.viewModeChanged({ viewMode: 'advanced' })
    );
  });

  it('should dispatch displayedColumnsChanged on data view column change', async () => {
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ChatSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    chatSearch = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      ChatSearchHarness
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      ChatSearchActions.displayedColumnsChanged({ displayedColumns: [] })
    );

    jest.clearAllMocks();

    store.overrideSelector(selectChatSearchViewModel, {
      ...baseChatSearchViewModel,
      columns: [
        {
          columnType: ColumnType.STRING,
          nameKey: 'COLUMN_KEY',
          id: 'column_1',
        },
        {
          columnType: ColumnType.STRING,
          nameKey: 'SECOND_COLUMN_KEY',
          id: 'column_2',
        },
      ],
    });
    store.refreshState();

    const interactiveDataView = await chatSearch.getSearchResults();
    const columnGroupSelector =
      await interactiveDataView?.getCustomGroupColumnSelector();
    expect(columnGroupSelector).toBeTruthy();
    await columnGroupSelector!.openCustomGroupColumnSelectorDialog();
    const pickList = await columnGroupSelector!.getPicklist();
    const transferControlButtons = await pickList.getTransferControlsButtons();
    expect(transferControlButtons.length).toBe(4);
    const activateAllColumnsButton = transferControlButtons[3];
    await activateAllColumnsButton.click();
    const saveButton = await columnGroupSelector!.getSaveButton();
    await saveButton.click();

    expect(store.dispatch).toHaveBeenCalledWith(
      ChatSearchActions.displayedColumnsChanged({
        displayedColumns: [
          {
            columnType: ColumnType.STRING,
            nameKey: 'COLUMN_KEY',
            id: 'column_1',
          },
          {
            columnType: ColumnType.STRING,
            nameKey: 'SECOND_COLUMN_KEY',
            id: 'column_2',
          },
        ],
      })
    );
  });

  it('should dispatch chartVisibilityToggled on show/hide chart header', async () => {
    jest.spyOn(store, 'dispatch');

    store.overrideSelector(selectChatSearchViewModel, {
      ...baseChatSearchViewModel,
      chartVisible: false,
    });
    store.refreshState();

    const searchHeader = await chatSearch.getHeader();
    const pageHeader = await searchHeader.getPageHeader();
    const overflowActionButton = await pageHeader.getOverflowActionMenuButton();
    await overflowActionButton?.click();

    const showChartActionItem = await pageHeader.getOverFlowMenuItem(
      'Show chart'
    );
    await showChartActionItem!.selectItem();
    expect(store.dispatch).toHaveBeenCalledWith(
      ChatSearchActions.chartVisibilityToggled()
    );
  });

  it('should display translated headers', async () => {
    const searchHeader = await chatSearch.getHeader();
    const pageHeader = await searchHeader.getPageHeader();
    expect(await pageHeader.getHeaderText()).toEqual('Chat Search');
    expect(await pageHeader.getSubheaderText()).toEqual(
      'Searching and displaying of Chat'
    );
  });

  it('should display translated empty message when no search results', async () => {
    const columns = [
      {
        columnType: ColumnType.STRING,
        nameKey: 'COLUMN_KEY',
        id: 'column_1',
      },
    ];
    store.overrideSelector(selectChatSearchViewModel, {
      ...baseChatSearchViewModel,
      results: [],
      columns: columns,
      displayedColumns: columns,
    });
    store.refreshState();

    const interactiveDataView = await chatSearch.getSearchResults();
    const dataView = await interactiveDataView.getDataView();
    const dataTable = await dataView.getDataTable();
    const rows = await dataTable?.getRows();
    expect(rows?.length).toBe(1);

    const rowData = await rows?.at(0)?.getData();
    expect(rowData?.length).toBe(1);
    expect(rowData?.at(0)).toEqual('No results.');
  });

  it('should not display chart when no results or toggled to not visible', async () => {
    component.diagramColumnId = 'column_1';

    store.overrideSelector(selectChatSearchViewModel, {
      ...baseChatSearchViewModel,
      results: [],
      chartVisible: true,
      columns: [
        {
          columnType: ColumnType.STRING,
          nameKey: 'COLUMN_KEY',
          id: 'column_1',
        },
      ],
    });
    store.refreshState();

    let diagram = await chatSearch.getDiagram();
    expect(diagram).toBeNull();

    store.overrideSelector(selectChatSearchViewModel, {
      ...baseChatSearchViewModel,
      results: [
        {
          id: '1',
          imagePath: '',
          column_1: 'val_1',
        },
      ],
      chartVisible: false,
      columns: [
        {
          columnType: ColumnType.STRING,
          nameKey: 'COLUMN_KEY',
          id: 'column_1',
        },
      ],
    });
    store.refreshState();

    diagram = await chatSearch.getDiagram();
    expect(diagram).toBeNull();

    store.overrideSelector(selectChatSearchViewModel, {
      ...baseChatSearchViewModel,
      results: [
        {
          id: '1',
          imagePath: '',
          column_1: 'val_1',
        },
      ],
      chartVisible: true,
      columns: [
        {
          columnType: ColumnType.STRING,
          nameKey: 'COLUMN_KEY',
          id: 'column_1',
        },
      ],
    });
    store.refreshState();

    diagram = await chatSearch.getDiagram();
    expect(diagram).toBeTruthy();
  });
});
