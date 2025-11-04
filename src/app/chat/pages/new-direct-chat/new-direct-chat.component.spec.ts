import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewDirectChatComponent } from './new-direct-chat.component';

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

  it('should update chat name', () => {
    const event = { target: { value: 'My Direct Chat' } } as any;
    component.onChatNameChange(event);
    
    component.chatName$.subscribe(value => {
      expect(value).toBe('My Direct Chat');
    });
  });

  it('should update recipient input', () => {
    component.onRecipientInputChange('test@example.com');
    
    component.recipientInput$.subscribe(value => {
      expect(value).toBe('test@example.com');
    });
  });

  it('should emit back event', () => {
    spyOn(component.back, 'emit');
    component.back.emit();
    expect(component.back.emit).toHaveBeenCalled();
  });

  it('should emit create event with recipient from input', () => {
    spyOn(component.create, 'emit');
    component.onRecipientInputChange('user@example.com');
    
    component.createDirectChat();
    
    expect(component.create.emit).toHaveBeenCalledWith({ recipient: 'user@example.com' });
  });

  it('should not emit create event when input is empty', () => {
    spyOn(component.create, 'emit');
    component.onRecipientInputChange('');
    
    component.createDirectChat();
    
    expect(component.create.emit).not.toHaveBeenCalled();
  });

  it('should trim whitespace from recipient input before creating chat', () => {
    spyOn(component.create, 'emit');
    component.onRecipientInputChange('  user@example.com  ');
    
    component.createDirectChat();
    
    expect(component.create.emit).toHaveBeenCalledWith({ recipient: 'user@example.com' });
  });
});
