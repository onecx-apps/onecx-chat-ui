import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatNewContentComponent } from './chat-new-content.component';
import { of } from 'rxjs';

describe('ChatNewContentComponent', () => {
  let component: ChatNewContentComponent;
  let fixture: ComponentFixture<ChatNewContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatNewContentComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatNewContentComponent);
    component = fixture.componentInstance;
    
    // Mock the required Observable inputs
    component.chatName$ = of('');
    component.recipientInput$ = of('');
    component.recipients$ = of([]);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit chatNameChange when input changes', () => {
    jest.spyOn(component.chatNameChange, 'emit');
    const event = { target: { value: 'Test Group' } } as any;
    component.chatNameChange.emit(event);
    expect(component.chatNameChange.emit).toHaveBeenCalledWith(event);
  });

  it('should emit recipientInputChange when input changes', () => {
    jest.spyOn(component.recipientInputChange, 'emit');
    const event = { target: { value: 'test@example.com' } } as any;
    component.recipientInputChange.emit(event);
    expect(component.recipientInputChange.emit).toHaveBeenCalledWith(event);
  });

  it('should emit addRecipient when + button clicked', () => {
    jest.spyOn(component.addRecipient, 'emit');
    component.addRecipient.emit();
    expect(component.addRecipient.emit).toHaveBeenCalled();
  });

  it('should emit removeRecipient with index when trash icon clicked', () => {
    jest.spyOn(component.removeRecipient, 'emit');
    component.removeRecipient.emit(0);
    expect(component.removeRecipient.emit).toHaveBeenCalledWith(0);
  });

  it('should emit createGroup when Create button clicked', () => {
    jest.spyOn(component.createGroup, 'emit');
    component.createGroup.emit();
    expect(component.createGroup.emit).toHaveBeenCalled();
  });
});
