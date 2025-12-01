import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NewDirectChatComponent } from './new-direct-chat.component';
import { skip } from 'rxjs/operators';

describe('NewDirectChatComponent', () => {
  let component: NewDirectChatComponent;
  let fixture: ComponentFixture<NewDirectChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDirectChatComponent]
    }).compileComponents();

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

  it('should update recipient input', fakeAsync(() => {
    let actual: string | undefined;
    component.recipientInput$.pipe(skip(1)).subscribe(value => {
      actual = value;
    });
    const event = { target: { value: 'test@example.com' } } as any;
    component.onRecipientInputChange(event);
    tick();
    expect(actual).toBe('test@example.com');
  }));

  it('should set recipient input to empty string if event.target is undefined', fakeAsync(() => {
    let actual: string | undefined;
    component.recipientInput$.pipe(skip(1)).subscribe(value => {
      actual = value;
    });
    const event = {} as any;
    component.onRecipientInputChange(event);
    tick();
    expect(actual).toBe('');
  }));

  it('should set recipient input to empty string if value is empty', fakeAsync(() => {
    let actual: string | undefined;
    component.recipientInput$.pipe(skip(1)).subscribe(value => {
      actual = value;
    });
    const event = { target: { value: '' } } as any;
    component.onRecipientInputChange(event);
    tick();
    expect(actual).toBe('');
  }));

  it('should emit back event', () => {
    jest.spyOn(component.back, 'emit');
    component.back.emit();
    expect(component.back.emit).toHaveBeenCalled();
  });
  it('should call onAddRecipient without error', () => {
    expect(() => component.onAddRecipient()).not.toThrow();
  });

  it('should call onRemoveRecipient without error', () => {
    expect(() => component.onRemoveRecipient(0)).not.toThrow();
  });
});
