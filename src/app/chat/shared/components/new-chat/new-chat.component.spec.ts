import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NewChatComponent } from './new-chat.component';
import * as NewChatActions from './new-chat.actions';
import * as NewChatSelectors from './new-chat.selectors';

describe('NewChatComponent', () => {
  let component: NewChatComponent;
  let fixture: ComponentFixture<NewChatComponent>;
  let store: MockStore;
  let translateService: TranslateService;

  const initialState = {
    chat: {
      newChat: {
        direct: {
          chatName: '',
          recipientInput: ''
        },
        group: {
          chatName: '',
          recipientInput: '',
          recipients: []
        },
        ai: {
          chatName: ''
        }
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NewChatComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    translateService = TestBed.inject(TranslateService);
    
    jest.spyOn(store, 'dispatch');
    jest.spyOn(translateService, 'instant').mockReturnValue('Translated Text');
    
    fixture = TestBed.createComponent(NewChatComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
    store.overrideSelector(NewChatSelectors.selectDirectChatName, '');
    store.overrideSelector(NewChatSelectors.selectDirectRecipientInput, '');
    store.refreshState();
  });

  describe('Component Initialization', () => {
    it('should create with default properties', () => {
      expect(component).toBeTruthy();
      expect(component.today).toBeInstanceOf(Date);
      expect(component.chatType).toBe('direct');
    });
  });

  describe('ngOnInit', () => {
    it('should initialize form with controls', () => {
      component.ngOnInit();

      expect(component.chatForm).toBeDefined();
      expect(component.chatForm.get('chatName')).toBeDefined();
      expect(component.chatForm.get('recipientInput')).toBeDefined();
      expect(component.chatForm.get('recipientInput')?.hasError('required')).toBe(true);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy$ subject', () => {
      component.ngOnInit();
      const destroySubject = component['destroy$'];
      const nextSpy = jest.spyOn(destroySubject, 'next');
      const completeSpy = jest.spyOn(destroySubject, 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expect(completeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('syncFormWithStore - Direct Chat', () => {
    beforeEach(() => {
      component.chatType = 'direct';
    });

    it('should sync chatName and recipientInput from store', (done) => {
      store.overrideSelector(NewChatSelectors.selectDirectChatName, 'Store Chat Name');
      store.overrideSelector(NewChatSelectors.selectDirectRecipientInput, 'user@example.com');
      store.refreshState();
      
      component.ngOnInit();

      setTimeout(() => {
        expect(component.chatForm.get('chatName')?.value).toBe('Store Chat Name');
        expect(component.chatForm.get('recipientInput')?.value).toBe('user@example.com');
        done();
      }, 100);
    });

    it('should not sync for group or AI chat types', (done) => {
      component.chatType = 'group';
      const selectSpy = jest.spyOn(store, 'select');
      
      component.ngOnInit();

      setTimeout(() => {
        const directCalls = selectSpy.mock.calls.filter(call => 
          call[0] === NewChatSelectors.selectDirectChatName || 
          call[0] === NewChatSelectors.selectDirectRecipientInput
        );
        expect(directCalls.length).toBe(0);
        done();
      }, 100);
    });
  });

  describe('setupFormValueChanges', () => {
    it('should dispatch setDirectChatName and setDirectRecipientInput for direct chat', (done) => {
      component.chatType = 'direct';
      component.ngOnInit();
      jest.clearAllMocks();

      component.chatForm.get('chatName')?.setValue('New Name');
      component.chatForm.get('recipientInput')?.setValue('user@test.com');

      setTimeout(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
          NewChatActions.setDirectChatName({ chatName: 'New Name' })
        );
        expect(store.dispatch).toHaveBeenCalledWith(
          NewChatActions.setDirectRecipientInput({ recipientInput: 'user@test.com' })
        );
        done();
      }, 100);
    });

    it('should dispatch setGroupChatName for group chat', (done) => {
      component.chatType = 'group';
      component.ngOnInit();
      jest.clearAllMocks();

      component.chatForm.get('chatName')?.setValue('Group Name');

      setTimeout(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
          NewChatActions.setGroupChatName({ chatName: 'Group Name' })
        );
        done();
      }, 100);
    });

    it('should dispatch setAIChatName for AI chat', (done) => {
      component.chatType = 'ai';
      component.ngOnInit();
      jest.clearAllMocks();

      component.chatForm.get('chatName')?.setValue('AI Chat Name');

      setTimeout(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
          NewChatActions.setAIChatName({ chatName: 'AI Chat Name' })
        );
        done();
      }, 100);
    });
  });

  describe('Getters', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('showChatNameInput should return correct values', () => {
      component.chatType = 'direct';
      expect(component.showChatNameInput).toBe(true);
      
      component.chatType = 'group';
      expect(component.showChatNameInput).toBe(true);
      
      component.chatType = 'ai';
      expect(component.showChatNameInput).toBe(false);
    });

    it('chatNamePlaceholder should return correct translations', () => {
      jest.spyOn(translateService, 'instant').mockImplementation((key: string | string[], params?: any) => {
        if (key === 'CHAT.INPUT.DIRECT_CHAT_PLACEHOLDER') {
          return `Direct Chat ${params?.date}`;
        }
        if (key === 'CHAT.INPUT.GROUP_CHAT_PLACEHOLDER') {
          return `Group Chat ${params?.date}`;
        }
        return key as string;
      });

      component.chatType = 'direct';
      expect(component.chatNamePlaceholder).toContain('Direct Chat');
      
      component.chatType = 'group';
      expect(component.chatNamePlaceholder).toContain('Group Chat');
    });

    it('recipientLabel should return correct translations', () => {
      jest.spyOn(translateService, 'instant').mockImplementation((key: string | string[]) => {
        return key === 'CHAT.INPUT.RECIPIENT' ? 'Recipient' : 'Recipients';
      });

      component.chatType = 'direct';
      expect(component.recipientLabel).toBe('Recipient');
      
      component.chatType = 'group';
      expect(component.recipientLabel).toBe('Recipients');
    });

    it('form should have chatName and recipientInput controls', () => {
      expect(component.chatForm.get('chatName')).toBeDefined();
      expect(component.chatForm.get('recipientInput')).toBeDefined();
    });
  });

  describe('onCreate', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should not emit when form is invalid', () => {
      const emitSpy = jest.spyOn(component.createChat, 'emit');
      expect(component.chatForm.valid).toBe(false);

      component.onCreate();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should emit when form is valid', () => {
      const emitSpy = jest.spyOn(component.createChat, 'emit');
      component.chatForm.get('recipientInput')?.setValue('user@test.com');
      expect(component.chatForm.valid).toBe(true);

      component.onCreate();

      expect(emitSpy).toHaveBeenCalledWith();
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete direct chat flow', (done) => {
      component.chatType = 'direct';
      component.ngOnInit();

      setTimeout(() => {
        jest.clearAllMocks();
        
        component.chatForm.get('chatName')?.setValue('My Chat');
        component.chatForm.get('recipientInput')?.setValue('user@test.com');

        setTimeout(() => {
          expect(store.dispatch).toHaveBeenCalledWith(
            NewChatActions.setDirectChatName({ chatName: 'My Chat' })
          );
          expect(store.dispatch).toHaveBeenCalledWith(
            NewChatActions.setDirectRecipientInput({ recipientInput: 'user@test.com' })
          );
          
          const emitSpy = jest.spyOn(component.createChat, 'emit');
          component.onCreate();
          expect(emitSpy).toHaveBeenCalled();
          
          done();
        }, 100);
      }, 100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing chatName control gracefully', () => {
      component.ngOnInit();
      component.chatForm.removeControl('chatName');
      
      expect(() => {
        component['setupFormValueChanges']();
      }).not.toThrow();
    });

    it('should handle missing recipientInput control gracefully', () => {
      component.ngOnInit();
      component.chatForm.removeControl('recipientInput');
      
      expect(() => {
        component['setupFormValueChanges']();
      }).not.toThrow();
    });

    it('should not dispatch actions when controls are missing', (done) => {
      component.chatType = 'direct';
      component['initializeForm']();
      component.chatForm.removeControl('chatName');
      component.chatForm.removeControl('recipientInput');
      
      jest.clearAllMocks();
      component['setupFormValueChanges']();
      
      setTimeout(() => {
        const calls = (store.dispatch as jest.Mock).mock.calls;
        expect(calls.length).toBe(0);
        done();
      }, 100);
    });
  });
});
