import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AIChatComponent } from './chat-assistant.component';

describe('FullChatComponent', () => {
  let component: AIChatComponent;
  let fixture: ComponentFixture<AIChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AIChatComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AIChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
