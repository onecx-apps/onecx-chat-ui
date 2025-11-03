import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LetDirective } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { PortalCoreModule } from '@onecx/portal-integration-angular';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { ChatAssistantComponent } from './chat-assistant.component';
import { initialState } from './chat-assistant.reducers';

describe('ChatAssistantComponent', () => {
  let component: ChatAssistantComponent;
  let fixture: ComponentFixture<ChatAssistantComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedChatMode and emit sidebarVisibleChange on close', () => {
    const spy = jest.spyOn(component.sidebarVisibleChange, 'emit');
    component.selectChatMode('close');
    expect(component._sidebarVisible).toBe(false);
    expect(component.selectedChatMode).toBeNull();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should set selectedChatMode to mode', () => {
    component.selectChatMode('ai');
    expect(component.selectedChatMode).toBe('ai');
  });

  it('should reset selectedChatMode on goBack', () => {
    component.selectedChatMode = 'ai';
    component.goBack();
    expect(component.selectedChatMode).toBeNull();
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
});
