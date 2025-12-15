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

  it('should have default chatNamePlaceholder as empty string', () => {
    expect(component.chatNamePlaceholder).toBe('');
  });

  describe('Layout based on chat type', () => {
    it('should have settingsType property that determines which components are shown', () => {
      expect(component.settingsType).toBeDefined();
      
      // Test that settingsType can be set to different values
      component.settingsType = 'ai';
      expect(component.settingsType).toBe('ai');
      
      component.settingsType = 'direct';
      expect(component.settingsType).toBe('direct');
      
      component.settingsType = 'group';
      expect(component.settingsType).toBe('group');
    });
  });

  describe('Create button behavior', () => {
    it('should emit form value when onCreate is called', () => {
      component.ngOnInit();
      component.chatForm.addControl('chatName', new FormControl('Test Chat'));
      component.chatForm.addControl('recipients', new FormControl(['user1']));
      const emitSpy = jest.spyOn(component.create, 'emit');
      
      component.onCreate();
      
      expect(emitSpy).toHaveBeenCalledWith({
        chatName: 'Test Chat',
        recipients: ['user1']
      });
    });

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
