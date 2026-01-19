import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SimpleChanges } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PortalCoreModule } from '@onecx/portal-integration-angular';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { ChatAssistantComponent } from './chat-assistant.component';
import { initialState } from './chat-assistant.reducers';
import { ChatAssistantActions } from './chat-assistant.actions';
import { ChatType } from 'src/app/shared/generated';

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

    fixture = TestBed.createComponent(ChatAssistantComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedChatMode and emit sidebarVisibleChange on close', () => {
    jest.spyOn(store, 'dispatch');
    const spy = jest.spyOn(component.sidebarVisibleChange, 'emit');
    
    component.selectChatMode('close');
    
    expect(component._sidebarVisible).toBe(false);
    expect(component.selectedChatMode).toBeNull();
    expect(spy).toHaveBeenCalledWith(false);
    expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatPanelClosed());
  });

  it('should set selectedChatMode to mode and dispatch chatModeSelected', () => {
    jest.spyOn(store, 'dispatch');
    
    component.selectChatMode('ai');
    
    expect(component.selectedChatMode).toBe('ai');
    expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatModeSelected({ mode: 'ai' }));
  });

  it('should handle different chat modes', () => {
    jest.spyOn(store, 'dispatch');
    
    component.selectChatMode('direct');
    
    expect(component.selectedChatMode).toBe('direct');
    expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatModeSelected({ mode: 'direct' }));
  });

  it('should reset selectedChatMode and dispatch chatModeDeselected on goBack', () => {
    jest.spyOn(store, 'dispatch');
    component.selectedChatMode = 'ai';
    
    component.goBack();
    
    expect(component.selectedChatMode).toBeNull();
    expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatModeDeselected());
  });

  describe('closeSidebar', () => {
    it('should close sidebar, emit event, dispatch action and reset selectedChatMode', () => {
      jest.spyOn(store, 'dispatch');
      jest.spyOn(component.sidebarVisibleChange, 'emit');
      component._sidebarVisible = true;
      component.selectedChatMode = 'ai';
      
      component.closeSidebar();
      
      expect(component._sidebarVisible).toBe(false);
      expect(component.selectedChatMode).toBeNull();
      expect(component.sidebarVisibleChange.emit).toHaveBeenCalledWith(false);
      expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatPanelClosed());
    });

    it('should work when selectedChatMode is already null', () => {
      jest.spyOn(store, 'dispatch');
      jest.spyOn(component.sidebarVisibleChange, 'emit');
      component._sidebarVisible = true;
      component.selectedChatMode = null;
      
      component.closeSidebar();
      
      expect(component._sidebarVisible).toBe(false);
      expect(component.selectedChatMode).toBeNull();
      expect(component.sidebarVisibleChange.emit).toHaveBeenCalledWith(false);
      expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatPanelClosed());
    });
  });

  describe('onDocumentClick', () => {
    let mockEvent: MouseEvent;
    let mockElement: HTMLElement;

    beforeEach(() => {
      component._sidebarVisible = true;
      mockElement = document.createElement('div');
    });

    it('should not close sidebar when sidebar is not visible', () => {
      component._sidebarVisible = false;
      const spy = jest.spyOn(component, 'closeSidebar');
      
      mockEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(mockEvent, 'target', { value: mockElement, enumerable: true });
      
      component.onDocumentClick(mockEvent);
      
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not close sidebar when clicking inside sidebar', () => {
      const sidebarElement = document.createElement('div');
      sidebarElement.classList.add('p-sidebar');
      mockElement.appendChild(sidebarElement);
      
      const spy = jest.spyOn(component, 'closeSidebar');
      mockEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(mockEvent, 'target', { value: sidebarElement, enumerable: true });
      
      component.onDocumentClick(mockEvent);
      
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not close sidebar when clicking on chat toggle button', () => {
      const buttonElement = document.createElement('button');
      buttonElement.setAttribute('aria-label', 'Chat Assistant');
      mockElement.appendChild(buttonElement);
      
      const spy = jest.spyOn(component, 'closeSidebar');
      mockEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(mockEvent, 'target', { value: buttonElement, enumerable: true });
      
      component.onDocumentClick(mockEvent);
      
      expect(spy).not.toHaveBeenCalled();
    });

    it('should close sidebar when clicking outside sidebar and not on toggle button', () => {
      const spy = jest.spyOn(component, 'closeSidebar');
      mockEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(mockEvent, 'target', { value: mockElement, enumerable: true });
      
      component.onDocumentClick(mockEvent);
      
      expect(spy).toHaveBeenCalled();
    });

    it('should not close sidebar when clicking inside app-chat-header', () => {
      const headerElement = document.createElement('app-chat-header');
      mockElement.appendChild(headerElement);
      
      const spy = jest.spyOn(component, 'closeSidebar');
      mockEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(mockEvent, 'target', { value: headerElement, enumerable: true });
      
      component.onDocumentClick(mockEvent);
      
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not close sidebar when clicking inside app-chat-option-button', () => {
      const buttonElement = document.createElement('app-chat-option-button');
      mockElement.appendChild(buttonElement);
      
      const spy = jest.spyOn(component, 'closeSidebar');
      mockEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(mockEvent, 'target', { value: buttonElement, enumerable: true });
      
      component.onDocumentClick(mockEvent);
      
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('sidebarVisible setter', () => {
    beforeEach(() => {
      jest.spyOn(store, 'dispatch');
    });

    it('should dispatch chatPanelOpened action when sidebarVisible is set to true', () => {
      component.sidebarVisible = true;
      
      expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatPanelOpened());
      expect(component._sidebarVisible).toBe(true);
    });

    it('should not dispatch action when sidebarVisible is set to false', () => {
      component.sidebarVisible = false;
      
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(component._sidebarVisible).toBe(false);
    });
  });

  describe('menuItems observable', () => {
    it('should create menu items with delete action', (done) => {
      const mockViewModel = {
        chats: [],
        currentChat: { id: 'chat1', topic: 'Test Chat', type: ChatType.AiChat },
        currentMessages: [],
        chatTitleKey: 'CHAT.TITLE.AI'
      };

      store.setState({
        chat: {
          assistant: {
            ...initialState,
            currentChat: mockViewModel.currentChat
          }
        }
      });

      component.menuItems.subscribe(items => {
        expect(items).toHaveLength(1);
        expect(items[0].label).toBe('Chat löschen');
        expect(items[0].icon).toBe('pi pi-trash');
        expect(items[0].disabled).toBe(false);
        expect(typeof items[0].command).toBe('function');
        done();
      });
    });

    it('should disable delete action when current chat id is "new"', (done) => {
      const mockViewModel = {
        chats: [],
        currentChat: { id: 'new', topic: 'New Chat', type: ChatType.AiChat },
        currentMessages: [],
        chatTitleKey: 'CHAT.TITLE.AI'
      };

      store.setState({
        chat: {
          assistant: {
            ...initialState,
            currentChat: mockViewModel.currentChat
          }
        }
      });

      component.menuItems.subscribe(items => {
        expect(items[0].disabled).toBe(true);
        done();
      });
    });

    it('should dispatch currentChatDeleted action when delete command is executed', () => {
      jest.spyOn(store, 'dispatch');
      
      const mockViewModel = {
        chats: [],
        currentChat: { id: 'chat1', topic: 'Test Chat', type: ChatType.AiChat },
        currentMessages: [],
        chatTitleKey: 'CHAT.TITLE.AI'
      };

      store.setState({
        chat: {
          assistant: {
            ...initialState,
            currentChat: mockViewModel.currentChat
          }
        }
      });

      component.menuItems.subscribe(items => {
        if (items[0].command) {
          items[0].command({});
        }
        expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.currentChatDeleted());
      });
    });
  });

  describe('sendMessage', () => {
    it('should dispatch messageSent action with correct message', () => {
      jest.spyOn(store, 'dispatch');
      const testMessage = 'Hello, this is a test message';
      
      component.sendMessage(testMessage);
      
      expect(store.dispatch).toHaveBeenCalledWith(
        ChatAssistantActions.messageSent({
          message: testMessage
        })
      );
    });

    it('should handle empty message', () => {
      jest.spyOn(store, 'dispatch');
      
      component.sendMessage('');
      
      expect(store.dispatch).toHaveBeenCalledWith(
        ChatAssistantActions.messageSent({
          message: ''
        })
      );
    });
  });

  describe('chatSelected', () => {
    it('should dispatch chatSelected action with correct chat', () => {
      jest.spyOn(store, 'dispatch');
      const testChat = { id: 'chat1', topic: 'Test Chat', type: ChatType.AiChat };
      
      component.chatSelected(testChat);
      
      expect(store.dispatch).toHaveBeenCalledWith(
        ChatAssistantActions.chatSelected({
          chat: testChat
        })
      );
    });

    it('should handle chat with different types', () => {
      jest.spyOn(store, 'dispatch');
      const humanChat = { id: 'chat2', topic: 'Human Chat', type: ChatType.HumanChat };
      
      component.chatSelected(humanChat);
      
      expect(store.dispatch).toHaveBeenCalledWith(
        ChatAssistantActions.chatSelected({
          chat: humanChat
        })
      );
    });
  });

  describe('ngOnChanges', () => {
    it('should emit sidebarVisibleChange when sidebarVisible changes', () => {
      jest.spyOn(component.sidebarVisibleChange, 'emit');
      
      const changes: SimpleChanges = {
        sidebarVisible: {
          currentValue: true,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      };
      
      component.ngOnChanges(changes);
      
      expect(component.sidebarVisibleChange.emit).toHaveBeenCalledWith(true);
    });

    it('should not emit when sidebarVisible does not change', () => {
      jest.spyOn(component.sidebarVisibleChange, 'emit');
      
      const changes: SimpleChanges = {
        otherProperty: {
          currentValue: 'new',
          previousValue: 'old',
          firstChange: false,
          isFirstChange: () => false
        }
      };
      
      component.ngOnChanges(changes);
      
      expect(component.sidebarVisibleChange.emit).not.toHaveBeenCalled();
    });

    it('should emit with false when sidebar is closed', () => {
      jest.spyOn(component.sidebarVisibleChange, 'emit');
      
      const changes: SimpleChanges = {
        sidebarVisible: {
          currentValue: false,
          previousValue: true,
          firstChange: false,
          isFirstChange: () => false
        }
      };
      
      component.ngOnChanges(changes);
      
      expect(component.sidebarVisibleChange.emit).toHaveBeenCalledWith(false);
    });
  });
});