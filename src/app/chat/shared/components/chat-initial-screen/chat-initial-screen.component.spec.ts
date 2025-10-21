import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatInitialScreenComponent } from './chat-initial-screen.component';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatOptionButtonComponent } from '../chat-option-button/chat-option-button.component';
import { By } from '@angular/platform-browser';

describe('ChatInitialScreenComponent', () => {
  let component: ChatInitialScreenComponent;
  let fixture: ComponentFixture<ChatInitialScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatInitialScreenComponent, ChatHeaderComponent, ChatOptionButtonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ChatInitialScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selectMode when AI Companion button is clicked', () => {
    jest.spyOn(component.selectMode, 'emit');
    const aiBtn = fixture.debugElement.queryAll(By.css('app-chat-option-button'))[0];
    aiBtn.triggerEventHandler('buttonClick', null);
    expect(component.selectMode.emit).toHaveBeenCalledWith('ai');
  });

  it('should emit selectMode when Direct Chat button is clicked', () => {
    jest.spyOn(component.selectMode, 'emit');
    const directBtn = fixture.debugElement.queryAll(By.css('app-chat-option-button'))[1];
    directBtn.triggerEventHandler('buttonClick', null);
    expect(component.selectMode.emit).toHaveBeenCalledWith('direct');
  });

  it('should emit selectMode when Group Chat button is clicked', () => {
    jest.spyOn(component.selectMode, 'emit');
    const groupBtn = fixture.debugElement.queryAll(By.css('app-chat-option-button'))[2];
    groupBtn.triggerEventHandler('buttonClick', null);
    expect(component.selectMode.emit).toHaveBeenCalledWith('group');
  });

  it('should emit selectMode with "close" when header close is clicked', () => {
    jest.spyOn(component.selectMode, 'emit');
    const header = fixture.debugElement.query(By.directive(ChatHeaderComponent));
    header.triggerEventHandler('closed', null);
    expect(component.selectMode.emit).toHaveBeenCalledWith('close');
  });
});
