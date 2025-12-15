import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DirectChatSettingsComponent } from './direct-chat-settings.component';
import { TranslateTestingModule } from 'ngx-translate-testing';

describe('DirectChatSettingsComponent', () => {
  let component: DirectChatSettingsComponent;
  let fixture: ComponentFixture<DirectChatSettingsComponent>;
  let form: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DirectChatSettingsComponent,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations(
          'en',
          // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
          require('./../../../../../assets/i18n/en.json')
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        ).withTranslations('de', require('./../../../../../assets/i18n/de.json')),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    form = new FormGroup({});
    fixture = TestBed.createComponent(DirectChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add recipientInput control on init if not present', () => {
    expect(form.contains('recipientInput')).toBe(false);
    component.ngOnInit();
    expect(form.contains('recipientInput')).toBe(true);
    expect(form.get('recipientInput')).toBeInstanceOf(FormControl);
    expect(form.get('recipientInput')?.validator).toBeTruthy();
  });

  it('should not overwrite recipientInput if already present', () => {
    const existing = new FormControl('existing', Validators.required);
    form.addControl('recipientInput', existing);
    component.ngOnInit();
    expect(form.get('recipientInput')).toBe(existing);
  });

  it('should remove recipientInput control on destroy if present', () => {
    component.ngOnInit();
    expect(form.contains('recipientInput')).toBe(true);
    component.ngOnDestroy();
    expect(form.contains('recipientInput')).toBe(false);
  });

  it('should not throw if recipientInput not present on destroy', () => {
    expect(form.contains('recipientInput')).toBe(false);
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('recipientInputControl getter should return the control', () => {
    component.ngOnInit();
    expect(component.recipientInputControl).toBe(form.get('recipientInput'));
  });
});
