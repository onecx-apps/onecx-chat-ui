import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatOptionButtonComponent } from './chat-option-button.component';
import { By } from '@angular/platform-browser';

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
    const titleEl = fixture.debugElement.query(By.css('.button-title'));
    const subtitleEl = fixture.debugElement.query(By.css('.button-subtitle'));
    expect(titleEl.nativeElement.textContent).toContain('AI Companion');
    expect(subtitleEl.nativeElement.textContent).toContain('smart answers');
  });

  it('should emit buttonClick event when button is clicked', () => {
    jest.spyOn(component.buttonClick, 'emit');
    const btn = fixture.debugElement.query(By.css('.chat-option-button'));
    btn.nativeElement.click();
    expect(component.buttonClick.emit).toHaveBeenCalled();
  });
});
