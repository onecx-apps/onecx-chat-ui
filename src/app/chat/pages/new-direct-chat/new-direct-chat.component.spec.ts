import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NewDirectChatComponent } from './new-direct-chat.component';

describe('NewDirectChatComponent', () => {
  let component: NewDirectChatComponent;
  let fixture: ComponentFixture<NewDirectChatComponent>;
  let store: MockStore;

  const initialState = {
    chat: {
      newGroup: {
        chatName: 'Direct Chat',
        recipientInput: '',
        recipients: []
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDirectChatComponent],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(NewDirectChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default chat name', () => {
    component.chatName$.subscribe(value => {
      expect(value).toBe('Direct Chat');
    });
  });

  it('should dispatch setRecipientInput action with value', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event = { target: { value: 'test@example.com' } } as any;
    component.onRecipientInputChange(event);
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientInput: 'test@example.com'
      })
    );
  });

  it('should dispatch setRecipientInput action with empty string if event.target is undefined', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event = {} as any;
    component.onRecipientInputChange(event);
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientInput: ''
      })
    );
  });

  it('should dispatch setRecipientInput action with empty string if value is empty', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event = { target: { value: '' } } as any;
    component.onRecipientInputChange(event);
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientInput: ''
      })
    );
  });

  it('should emit back event', () => {
    jest.spyOn(component.back, 'emit');
    component.back.emit();
    expect(component.back.emit).toHaveBeenCalled();
  });
  it('should dispatch addRecipient action when onAddRecipient is called', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onAddRecipient();
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        recipient: ''
      })
    );
  });

  it('should dispatch removeRecipient action when onRemoveRecipient is called', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onRemoveRecipient(0);
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        index: 0
      })
    );
  });
});
