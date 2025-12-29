import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatSettingsComponent } from './chat-settings.component';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateTestingModule } from 'ngx-translate-testing';

describe('ChatSettingsComponent', () => {
  let component: ChatSettingsComponent;
  let fixture: ComponentFixture<ChatSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChatSettingsComponent,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations(
          'en',
          // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
          require('./../../../../../assets/i18n/en.json'),
          // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        ).withTranslations('de', require('./../../../../../assets/i18n/de.json')),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatSettingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize chatForm on ngOnInit', () => {
    component.ngOnInit();
    expect(component.chatForm).toBeTruthy();
    expect(component.chatForm).toBeInstanceOf(FormGroup);
  });

  it('should mark all controls as touched and not emit if form is invalid on onCreate', () => {
    component.ngOnInit();
    const emitSpy = jest.spyOn(component.create, 'emit');
    component.chatForm.addControl('testControl', new FormControl('', Validators.required));
    
    component.onCreate();
    
    expect(component.chatForm.get('testControl')?.touched).toBe(true);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit form value if form is valid on onCreate', () => {
    component.ngOnInit();
    const emitSpy = jest.spyOn(component.create, 'emit');
    
    component.onCreate();
    
    expect(emitSpy).toHaveBeenCalledWith({});
  });

  it('should emit correct data with recipients when onCreate is called', () => {
    component.ngOnInit();
    component.chatForm.addControl('recipients', new FormControl(['user1', 'user2']));
    const emitSpy = jest.spyOn(component.create, 'emit');
    
    component.onCreate();
    
    expect(emitSpy).toHaveBeenCalledWith({ recipients: ['user1', 'user2'] });
  });

  it('should emit correct data with recipientInput when onCreate is called', () => {
    component.ngOnInit();
    component.chatForm.addControl('recipientInput', new FormControl('test@example.com'));
    const emitSpy = jest.spyOn(component.create, 'emit');
    
    component.onCreate();
    
    expect(emitSpy).toHaveBeenCalledWith({ recipientInput: 'test@example.com' });
  });

  it('should emit data with both recipients and recipientInput', () => {
    component.ngOnInit();
    component.chatForm.addControl('recipients', new FormControl(['user1']));
    component.chatForm.addControl('recipientInput', new FormControl('user2@test.com'));
    const emitSpy = jest.spyOn(component.create, 'emit');
    
    component.onCreate();
    
    expect(emitSpy).toHaveBeenCalledWith({ 
      recipients: ['user1'],
      recipientInput: 'user2@test.com'
    });
  });

  it('should have default settingsType as ai', () => {
    expect(component.settingsType).toBe('ai');
  });

  describe('Layout based on chat type', () => {
    it('should always show SharedChatSettingsComponent regardless of settingsType', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-shared-chat-settings')).toBeTruthy();
    });

    it('should show DirectChatSettingsComponent only when settingsType is "direct"', () => {
      component.settingsType = 'direct';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-direct-chat-settings')).toBeTruthy();
      expect(compiled.querySelector('app-group-chat-settings')).toBeFalsy();
    });

    it('should show GroupChatSettingsComponent only when settingsType is "group"', () => {
      component.settingsType = 'group';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-group-chat-settings')).toBeTruthy();
      expect(compiled.querySelector('app-direct-chat-settings')).toBeFalsy();
    });

    it('should not show type-specific components when settingsType is "ai"', () => {
      component.settingsType = 'ai';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-direct-chat-settings')).toBeFalsy();
      expect(compiled.querySelector('app-group-chat-settings')).toBeFalsy();
    });
  });

  describe('Create button behavior', () => {
    it('should emit empty object when onCreate is called with empty form', () => {
      component.ngOnInit();
      const emitSpy = jest.spyOn(component.create, 'emit');
      
      component.onCreate();
      
      expect(emitSpy).toHaveBeenCalledWith({});
    });

    it('should have form validity based on controls', () => {
      component.ngOnInit();
      
      // Empty form is valid
      expect(component.chatForm.valid).toBe(true);
      
      // Add required control - form becomes invalid
      component.chatForm.addControl('testControl', new FormControl('', Validators.required));
      expect(component.chatForm.invalid).toBe(true);
      
      // Fill the control - form becomes valid
      component.chatForm.get('testControl')?.setValue('test');
      expect(component.chatForm.valid).toBe(true);
    });
  });
});
