import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ChatNewGroupComponent } from './chat-new-group.component';
import * as ChatNewGroupActions from './chat-new-group.actions';
import * as ChatNewGroupSelectors from './chat-new-group.selectors';

describe('ChatNewGroupComponent', () => {
  let component: ChatNewGroupComponent;
  let fixture: ComponentFixture<ChatNewGroupComponent>;
  let store: MockStore;

  const initialState = {
    chat: {
      newGroup: {
        chatName: '',
        recipientInput: '',
        recipients: []
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatNewGroupComponent],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ChatNewGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select chatName$ from store', (done) => {
    store.overrideSelector(ChatNewGroupSelectors.selectChatName, 'Test Group');
    component.chatName$.subscribe(chatName => {
      expect(chatName).toBe('Test Group');
      done();
    });
  });

  it('should select recipientInput$ from store', (done) => {
    store.overrideSelector(ChatNewGroupSelectors.selectRecipientInput, 'test@example.com');
    component.recipientInput$.subscribe(input => {
      expect(input).toBe('test@example.com');
      done();
    });
  });

  it('should select recipients$ from store', (done) => {
    const mockRecipients = ['user1@test.com', 'user2@test.com'];
    store.overrideSelector(ChatNewGroupSelectors.selectRecipients, mockRecipients);
    component.recipients$.subscribe(recipients => {
      expect(recipients).toEqual(mockRecipients);
      done();
    });
  });

  it('should dispatch setChatName action on chat name change', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event = { target: { value: 'New Group Name' } } as any;
    
    component.onChatNameChange(event);
    
    expect(dispatchSpy).toHaveBeenCalledWith(
      ChatNewGroupActions.setChatName({ chatName: 'New Group Name' })
    );
  });

  it('should dispatch setRecipientInput action when string value provided', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    
    component.onRecipientInputChange('test@example.com');
    
    expect(dispatchSpy).toHaveBeenCalledWith(
      ChatNewGroupActions.setRecipientInput({ recipientInput: 'test@example.com' })
    );
  });

  it('should dispatch setRecipientInput action when Event provided', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event = { target: { value: 'test@example.com' } } as any;
    
    component.onRecipientInputChange(event);
    
    expect(dispatchSpy).toHaveBeenCalledWith(
      ChatNewGroupActions.setRecipientInput({ recipientInput: 'test@example.com' })
    );
  });

  it('should dispatch addRecipient action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    
    component.onAddRecipient();
    
    expect(dispatchSpy).toHaveBeenCalledWith(ChatNewGroupActions.addRecipient());
  });

  it('should dispatch removeRecipient action with index', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    
    component.onRemoveRecipient(1);
    
    expect(dispatchSpy).toHaveBeenCalledWith(
      ChatNewGroupActions.removeRecipient({ index: 1 })
    );
  });

  it('should emit create event with name and recipients', async () => {
    const createSpy = jest.spyOn(component.create, 'emit');
    store.overrideSelector(ChatNewGroupSelectors.selectChatName, 'Test Group');
    store.overrideSelector(ChatNewGroupSelectors.selectRecipients, ['user1@test.com']);
    store.refreshState();
    
    await component.createGroup();
    
    expect(createSpy).toHaveBeenCalledWith({
      name: 'Test Group',
      recipients: ['user1@test.com']
    });
  });

  it('should emit back event', () => {
    const backSpy = jest.spyOn(component.back, 'emit');
    
    component.back.emit();
    
    expect(backSpy).toHaveBeenCalled();
  });
});
