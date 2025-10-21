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

  it('should return correct chat title', () => {
    component.selectedChatMode = 'ai';
    expect(component.getChatTitle()).toBe('AI Companion');
    component.selectedChatMode = 'direct';
    expect(component.getChatTitle()).toBe('Direct Chat');
    component.selectedChatMode = 'group';
    expect(component.getChatTitle()).toBe('Group Chat');
    component.selectedChatMode = null;
    expect(component.getChatTitle()).toBe('Chat');
  });
});
