import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LetDirective } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PortalCoreModule } from '@onecx/portal-integration-angular';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { ChatAssistantComponent } from './chat-assistant.component';
import { initialState } from './chat-assistant.reducers';
import { ChatAssistantActions } from './chat-assistant.actions';
import { of } from 'rxjs';

describe('ChatAssistantComponent', () => {
  let component: ChatAssistantComponent;
  let fixture: ComponentFixture<ChatAssistantComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChatAssistantComponent,
        PortalCoreModule,
        LetDirective,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations(
          'en',
          // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
          require('./../../../../assets/i18n/en.json')
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        ).withTranslations('de', require('./../../../../assets/i18n/de.json')),
      ],
      providers: [
        provideMockStore({
          initialState: { chat: { assistant: initialState } },
        }),
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

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ChatAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have viewModel$ observable', () => {
      expect(component.viewModel$).toBeDefined();
    });

    it('should have menuItems observable', () => {
      expect(component.menuItems).toBeDefined();
    });
  });

  describe('menuItems', () => {
    it('should have delete menu item with correct properties', (done) => {
      component.menuItems.subscribe(menuItems => {
        const deleteItem = menuItems.find(item => item.icon === 'pi pi-trash');
        
        expect(deleteItem).toBeDefined();
        expect(deleteItem?.icon).toBe('pi pi-trash');
        expect(deleteItem?.label).toBeDefined();
        expect(typeof deleteItem?.label).toBe('string');
        expect(deleteItem?.command).toBeDefined();
        done();
      });
    });

    it('should dispatch currentChatDeleted when delete command is executed', (done) => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.menuItems.subscribe(menuItems => {
        const deleteItem = menuItems.find(item => item.icon === 'pi pi-trash');
        deleteItem?.command?.({});
        
        expect(dispatchSpy).toHaveBeenCalledWith(ChatAssistantActions.currentChatDeleted());
        done();
      });
    });

    it('should disable delete option when currentChat id is "new"', (done) => {
      store.setState({
        chat: {
          assistant: {
            ...initialState,
            currentChat: { id: 'new', topic: 'New Chat' } as any
          }
        }
      });

      component.menuItems.subscribe(menuItems => {
        const deleteItem = menuItems.find(item => item.icon === 'pi pi-trash');
        expect(deleteItem?.disabled).toBe(true);
        done();
      });
    });

    it('should enable delete option when currentChat id is not "new"', (done) => {
      store.setState({
        chat: {
          assistant: {
            ...initialState,
            currentChat: { id: 'chat123', topic: 'Existing Chat' } as any
          }
        }
      });

      component.menuItems.subscribe(menuItems => {
        const deleteItem = menuItems.find(item => item.icon === 'pi pi-trash');
        expect(deleteItem?.disabled).toBe(false);
        done();
      });
    });
  });

  describe('sendMessage', () => {
    it('should dispatch messageSent action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const message = 'Test message';

      component.sendMessage(message);

      expect(dispatchSpy).toHaveBeenCalledWith(
        ChatAssistantActions.messageSent({ message })
      );
    });
  });

  describe('chatSelected', () => {
    it('should dispatch chatSelected action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const chat = { id: 'chat1', topic: 'Test Chat' } as any;

      component.chatSelected(chat);

      expect(dispatchSpy).toHaveBeenCalledWith(
        ChatAssistantActions.chatSelected({ chat })
      );
    });
  });

  describe('openSidebar', () => {
    it('should dispatch chatPanelOpened', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.openSidebar();

      expect(dispatchSpy).toHaveBeenCalledWith(ChatAssistantActions.chatPanelOpened());
    });
  });

  describe('selectChatMode', () => {
    it('should close sidebar and deselect mode when mode is "close"', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.selectChatMode('close');

      expect(dispatchSpy).toHaveBeenCalledWith(ChatAssistantActions.chatPanelClosed());
      expect(dispatchSpy).toHaveBeenCalledWith(ChatAssistantActions.chatModeDeselected());
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it('should dispatch chatModeSelected for valid mode', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.selectChatMode('ai');

      expect(dispatchSpy).toHaveBeenCalledWith(
        ChatAssistantActions.chatModeSelected({ mode: 'ai' })
      );
    });

    it('should dispatch chatModeSelected for direct mode', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.selectChatMode('direct');

      expect(dispatchSpy).toHaveBeenCalledWith(
        ChatAssistantActions.chatModeSelected({ mode: 'direct' })
      );
    });

    it('should dispatch chatModeSelected for group mode', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.selectChatMode('group');

      expect(dispatchSpy).toHaveBeenCalledWith(
        ChatAssistantActions.chatModeSelected({ mode: 'group' })
      );
    });
  });

  describe('goBack', () => {
    it('should dispatch chatModeDeselected', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.goBack();

      expect(dispatchSpy).toHaveBeenCalledWith(ChatAssistantActions.chatModeDeselected());
    });
  });

  describe('closeSidebar', () => {
    it('should close sidebar and deselect mode', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.closeSidebar();

      expect(dispatchSpy).toHaveBeenCalledWith(ChatAssistantActions.chatPanelClosed());
      expect(dispatchSpy).toHaveBeenCalledWith(ChatAssistantActions.chatModeDeselected());
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('onDocumentClick', () => {
    let mockEvent: MouseEvent;
    let mockElement: HTMLElement;

    beforeEach(() => {
      mockElement = document.createElement('div');
      // Mock viewModel$ to return sidebarVisible: true
      component.viewModel$ = of({
        chats: [],
        currentChat: undefined,
        currentMessages: [],
        chatTitleKey: 'CHAT.TITLE.DEFAULT',
        sidebarVisible: true,
        selectedChatMode: null
      });
    });

    it('should not close sidebar when sidebar is not visible', async () => {
      component.viewModel$ = of({
        chats: [],
        currentChat: undefined,
        currentMessages: [],
        chatTitleKey: 'CHAT.TITLE.DEFAULT',
        sidebarVisible: false,
        selectedChatMode: null
      });

      const spy = jest.spyOn(component, 'closeSidebar');
      mockEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(mockEvent, 'target', { value: mockElement, enumerable: true });
      
      await component.onDocumentClick(mockEvent);
      
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not close sidebar when clicking inside sidebar', async () => {
      const sidebarElement = document.createElement('div');
      sidebarElement.classList.add('p-sidebar');
      mockElement.appendChild(sidebarElement);
      
      const spy = jest.spyOn(component, 'closeSidebar');
      mockEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(mockEvent, 'target', { value: sidebarElement, enumerable: true });
      
      await component.onDocumentClick(mockEvent);
      
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not close sidebar when clicking on chat toggle button', async () => {
      const buttonElement = document.createElement('button');
      buttonElement.setAttribute('aria-label', 'Chat Assistant');
      mockElement.appendChild(buttonElement);
      
      const spy = jest.spyOn(component, 'closeSidebar');
      mockEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(mockEvent, 'target', { value: buttonElement, enumerable: true });
      
      await component.onDocumentClick(mockEvent);
      
      expect(spy).not.toHaveBeenCalled();
    });

    it('should close sidebar when clicking outside sidebar and not on toggle button', async () => {
      const spy = jest.spyOn(component, 'closeSidebar');
      mockEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(mockEvent, 'target', { value: mockElement, enumerable: true });
      
      await component.onDocumentClick(mockEvent);
      
      expect(spy).toHaveBeenCalled();
    });

    it('should not close sidebar when clicking inside app-chat-header', async () => {
      const headerElement = document.createElement('app-chat-header');
      mockElement.appendChild(headerElement);
      
      const spy = jest.spyOn(component, 'closeSidebar');
      mockEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(mockEvent, 'target', { value: headerElement, enumerable: true });
      
      await component.onDocumentClick(mockEvent);
      
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not close sidebar when clicking inside app-chat-option-button', async () => {
      const buttonElement = document.createElement('app-chat-option-button');
      mockElement.appendChild(buttonElement);
      
      const spy = jest.spyOn(component, 'closeSidebar');
      mockEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(mockEvent, 'target', { value: buttonElement, enumerable: true });
      
      await component.onDocumentClick(mockEvent);
      
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not close sidebar when clicking inside app-chat-slider', async () => {
      const sliderElement = document.createElement('app-chat-slider');
      mockElement.appendChild(sliderElement);
      
      const spy = jest.spyOn(component, 'closeSidebar');
      mockEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(mockEvent, 'target', { value: sliderElement, enumerable: true });
      
      await component.onDocumentClick(mockEvent);
      
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not close sidebar when clicking inside app-chat-initial-screen', async () => {
      const initialScreenElement = document.createElement('app-chat-initial-screen');
      mockElement.appendChild(initialScreenElement);
      
      const spy = jest.spyOn(component, 'closeSidebar');
      mockEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(mockEvent, 'target', { value: initialScreenElement, enumerable: true });
      
      await component.onDocumentClick(mockEvent);
      
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
