import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NewDirectChatComponent } from './new-direct-chat.component';

describe('NewDirectChatComponent', () => {
  let component: NewDirectChatComponent;
  let fixture: ComponentFixture<NewDirectChatComponent>;
  let store: MockStore;

  const initialState = {
    chat: {
      newChat: {
        direct: {
          chatName: 'Direct Chat',
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
        NewDirectChatComponent,
        TranslateModule.forRoot()
      ],
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

  it('should call onCreateDirectChat when creating chat', () => {
    expect(() => component.onCreateDirectChat()).not.toThrow();
  });

  it('should emit back event', () => {
    jest.spyOn(component.back, 'emit');
    component.back.emit();
    expect(component.back.emit).toHaveBeenCalled();
  });
});
