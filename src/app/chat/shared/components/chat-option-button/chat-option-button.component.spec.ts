import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatOptionButtonComponent } from './chat-option-button.component';

describe('ChatOptionButtonComponent', () => {
  let component: ChatOptionButtonComponent;
  let fixture: ComponentFixture<ChatOptionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatOptionButtonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ChatOptionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title and subtitle', () => {
    component.title = 'AI Companion';
    component.subtitle = 'smart answers';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('AI Companion');
    expect(compiled.textContent).toContain('smart answers');
  });

  it('should emit buttonClick event when button is clicked', () => {
    jest.spyOn(component.buttonClick, 'emit');
    component.onButtonClick();
    expect(component.buttonClick.emit).toHaveBeenCalled();
  });
});
