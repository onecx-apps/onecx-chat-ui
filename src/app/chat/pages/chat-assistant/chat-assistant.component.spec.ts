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

  it('should set currentChatMode and emit sidebarVisibleChange on close', () => {
    jest.spyOn(store, 'dispatch');
    const spy = jest.spyOn(component.sidebarVisibleChange, 'emit');
    
    component.onChatModeSelected('close');
    
    expect(component._sidebarVisible).toBe(false);
    expect(component.currentChatMode).toBeNull();
    expect(spy).toHaveBeenCalledWith(false);
    expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatPanelClosed());
  });

  it('should set currentChatMode to mode and dispatch chatModeSelected', () => {
    jest.spyOn(store, 'dispatch');
    
    component.onChatModeSelected('ai');
    
    expect(component.currentChatMode).toBe('ai');
    expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatModeSelected({ mode: 'ai' }));
  });

  it('should handle different chat modes', () => {
    jest.spyOn(store, 'dispatch');
    
    component.onChatModeSelected('direct');
    
    expect(component.currentChatMode).toBe('direct');
    expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatModeSelected({ mode: 'direct' }));
  });

  it('should reset currentChatMode and dispatch chatModeDeselected on onBackFromNewChat', () => {
    jest.spyOn(store, 'dispatch');
    component.currentChatMode = 'ai';
    
    component.onBackFromNewChat();
    
    expect(component.currentChatMode).toBeNull();
    expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatModeDeselected());
  });

  describe('closeSidebar', () => {
    it('should close sidebar, emit event, dispatch action and reset currentChatMode', () => {
      jest.spyOn(store, 'dispatch');
      jest.spyOn(component.sidebarVisibleChange, 'emit');
      component._sidebarVisible = true;
      component.currentChatMode = 'ai';
      
      component.closeSidebar();
      
      expect(component._sidebarVisible).toBe(false);
      expect(component.currentChatMode).toBe('ai'); // currentChatMode is not reset by closeSidebar
      expect(component.sidebarVisibleChange.emit).toHaveBeenCalledWith(false);
      expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatPanelClosed());
    });

    it('should work when currentChatMode is already null', () => {
      jest.spyOn(store, 'dispatch');
      jest.spyOn(component.sidebarVisibleChange, 'emit');
      component._sidebarVisible = true;
      component.currentChatMode = null;
      
      component.closeSidebar();
      
      expect(component._sidebarVisible).toBe(false);
      expect(component.currentChatMode).toBeNull();
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

  describe('sidebarVisible setter - pokrycie currentPage = initial', () => {
    beforeEach(() => {
      jest.spyOn(store, 'dispatch');
    });

    it('should set currentPage to initial if not set when sidebarVisible is true', () => {
      component.currentPage = null;
      component.sidebarVisible = true;
      expect(component.currentPage).toBe('initial');
      expect(component._sidebarVisible).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatPanelOpened());
    });

    it('should not change currentPage if already set', () => {
      component.currentPage = 'newChat';
      component.sidebarVisible = true;
      expect(component.currentPage).toBe('newChat');
      expect(component._sidebarVisible).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatPanelOpened());
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

  describe('onCreateChat - pokrycie chatName trim/placeholder', () => {
    it('should use trimmed chatName if provided', () => {
      jest.spyOn(store, 'dispatch');
      component.currentChatMode = 'ai';
      component.chatNamePlaceholder = 'PLACEHOLDER';
      const formValue = {
        chatName: '  TestName  ',
        recipientInput: 'user1',
        recipients: ['user1', 'user2'],
      };
      component.onCreateChat(formValue as any);
      expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatCreateButtonClicked({
        chatName: 'TestName',
        chatMode: 'ai',
        recipientUserId: 'user1',
        participants: ['user1', 'user2'],
      }));
    });

    it('should use chatNamePlaceholder if chatName is empty or whitespace', () => {
      jest.spyOn(store, 'dispatch');
      component.currentChatMode = 'ai';
      component.chatNamePlaceholder = 'PLACEHOLDER';
      const formValue = {
        chatName: '   ',
        recipientInput: 'user1',
        recipients: ['user1', 'user2'],
      };
      component.onCreateChat(formValue as any);
      expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatCreateButtonClicked({
        chatName: 'PLACEHOLDER',
        chatMode: 'ai',
        recipientUserId: 'user1',
        participants: ['user1', 'user2'],
      }));
    });

    it('should use chatNamePlaceholder if chatName is undefined', () => {
      jest.spyOn(store, 'dispatch');
      component.currentChatMode = 'ai';
      component.chatNamePlaceholder = 'PLACEHOLDER';
      const formValue = {
        chatName: undefined,
        recipientInput: 'user1',
        recipients: ['user1', 'user2'],
      };
      component.onCreateChat(formValue as any);
      expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatCreateButtonClicked({
        chatName: 'PLACEHOLDER',
        chatMode: 'ai',
        recipientUserId: 'user1',
        participants: ['user1', 'user2'],
      }));
    });

    it('should use default chatMode "ai" if currentChatMode is null', () => {
      jest.spyOn(store, 'dispatch');
      component.currentChatMode = null;
      component.chatNamePlaceholder = 'PLACEHOLDER';
      const formValue = {
        chatName: 'TestName',
        recipientInput: 'user1',
        recipients: ['user1', 'user2'],
      };
      component.onCreateChat(formValue as any);
      expect(store.dispatch).toHaveBeenCalledWith(ChatAssistantActions.chatCreateButtonClicked({
        chatName: 'TestName',
        chatMode: 'ai',
        recipientUserId: 'user1',
        participants: ['user1', 'user2'],
      }));
    });
  });
});
