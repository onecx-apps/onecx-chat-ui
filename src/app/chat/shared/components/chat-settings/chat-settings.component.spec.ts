import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatSettingsComponent } from './chat-settings.component';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';

class MockTranslateService {
  get(key: any) { return of(key); }
  instant(key: any) { return key; }
}

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: any) { return value; }
}

describe('ChatSettingsComponent', () => {
  let component: ChatSettingsComponent;
  let fixture: ComponentFixture<ChatSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatSettingsComponent, ReactiveFormsModule, MockTranslatePipe],
      providers: [
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatSettingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and patch chatName on ngOnInit', () => {
    component.chatNamePlaceholder = 'testName';
    component.ngOnInit();
    expect(component.chatForm).toBeTruthy();
    expect(component.chatForm.get('chatName')?.value).toBe('testName');
  });

  it('should patch chatName on ngOnChanges if chatForm exists', () => {
    component.ngOnInit();
    component.chatForm.get('chatName')?.setValue('old');
    component.chatNamePlaceholder = 'newName';
    component.ngOnChanges({ chatNamePlaceholder: { currentValue: 'newName', previousValue: 'old', firstChange: false, isFirstChange: () => false } });
    expect(component.chatForm.get('chatName')?.value).toBe('newName');
  });

  it('should not throw on ngOnChanges if chatForm does not exist', () => {
    expect(() => component.ngOnChanges({ chatNamePlaceholder: { currentValue: 'x', previousValue: '', firstChange: true, isFirstChange: () => true } })).not.toThrow();
  });

  it('should clean up destroy$ on ngOnDestroy', () => {
    component.ngOnInit();
    const completeSpy = jest.spyOn((component as any).destroy$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should mark all as touched and not emit if form is invalid onCreate', () => {
    component.ngOnInit();
    const emitSpy = jest.spyOn(component.create, 'emit');
    component.chatForm.get('chatName')?.setValue('');
    component.onCreate();
    expect(component.chatForm.get('chatName')?.touched).toBe(true);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit form value if form is valid onCreate', () => {
    component.ngOnInit();
    const emitSpy = jest.spyOn(component.create, 'emit');
    component.chatForm.get('chatName')?.setValue('validName');
    component.onCreate();
    expect(emitSpy).toHaveBeenCalledWith({ chatName: 'validName' });
  });

  it('should mark all controls as touched if form is invalid onCreate (multiple controls)', () => {
    component.ngOnInit();
    component.chatForm.addControl('extra', new FormControl('', Validators.required));
    const emitSpy = jest.spyOn(component.create, 'emit');
    component.onCreate();
    expect(component.chatForm.get('chatName')?.touched).toBe(true);
    expect(component.chatForm.get('extra')?.touched).toBe(true);
    expect(component.chatForm.invalid).toBe(true);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should return chatNameControl', () => {
    component.ngOnInit();
    expect(component.chatNameControl).toBe(component.chatForm.get('chatName'));
  });

  it('should set settingsType input', () => {
    component.settingsType = 'group';
    expect(component.settingsType).toBe('group');
  });

  it('should set chatNamePlaceholder input', () => {
    component.chatNamePlaceholder = 'placeholder';
    expect(component.chatNamePlaceholder).toBe('placeholder');
  });
});
