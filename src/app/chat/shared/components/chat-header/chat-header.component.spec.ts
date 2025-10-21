import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatHeaderComponent } from './chat-header.component';
import { By } from '@angular/platform-browser';

describe('ChatHeaderComponent', () => {
  let component: ChatHeaderComponent;
  let fixture: ComponentFixture<ChatHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatHeaderComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ChatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    component.title = 'Test Title';
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.chat-title'));
    expect(titleEl.nativeElement.textContent).toContain('Test Title');
  });

  it('should emit closed event when close button is clicked', () => {
    component.showClose = true;
    fixture.detectChanges();
    jest.spyOn(component.closed, 'emit');
    const closeBtn = fixture.debugElement.query(By.css('.close-button'));
    closeBtn.nativeElement.click();
    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should emit backClicked event when back button is clicked', () => {
    component.showBack = true;
    component.showClose = false;
    fixture.detectChanges();
    jest.spyOn(component.backClicked, 'emit');
    const backBtn = fixture.debugElement.query(By.css('.back-button'));
    backBtn.nativeElement.click();
    expect(component.backClicked.emit).toHaveBeenCalled();
  });
});
