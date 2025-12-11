import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupChatSettingsComponent } from './group-chat-settings.component';
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

describe('GroupChatSettingsComponent', () => {
  let component: GroupChatSettingsComponent;
  let fixture: ComponentFixture<GroupChatSettingsComponent>;
  let form: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupChatSettingsComponent, ReactiveFormsModule, MockTranslatePipe],
      providers: [
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    }).compileComponents();

    TestBed.overrideComponent(GroupChatSettingsComponent, {
      set: {
        imports: [
          ReactiveFormsModule,
          MockTranslatePipe
        ]
      }
    });
  });

  it('should add recipients control on init if not present', () => {
    form = new FormGroup({});
    fixture = TestBed.createComponent(GroupChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    expect(form.contains('recipients')).toBe(false);
    fixture.detectChanges();
    expect(form.contains('recipients')).toBe(true);
    expect(form.get('recipients')).toBeInstanceOf(FormControl);
    expect(form.get('recipients')?.validator).toBeTruthy();
  });

  it('should not overwrite recipients if already present', () => {
    form = new FormGroup({});
    const existing = new FormControl(['existing'], Validators.required);
    form.addControl('recipients', existing);
    fixture = TestBed.createComponent(GroupChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    fixture.detectChanges();
    expect(form.get('recipients')).toBe(existing);
  });

  it('should remove recipients control on destroy if present', () => {
    form = new FormGroup({});
    fixture = TestBed.createComponent(GroupChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    fixture.detectChanges();
    expect(form.contains('recipients')).toBe(true);
    component.ngOnDestroy();
    expect(form.contains('recipients')).toBe(false);
  });

  it('should not throw if recipients not present on destroy', () => {
    form = new FormGroup({});
    fixture = TestBed.createComponent(GroupChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    expect(form.contains('recipients')).toBe(false);
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('should initialize recipients from form value', () => {
    form = new FormGroup({ recipients: new FormControl(['a', 'b']) });
    fixture = TestBed.createComponent(GroupChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    fixture.detectChanges();
    expect(component.recipients).toEqual(['a', 'b']);
  });

  it('should clear recipientInputControl on init', () => {
    form = new FormGroup({});
    fixture = TestBed.createComponent(GroupChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    component.recipientInputControl.setValue('test');
    fixture.detectChanges();
    expect(component.recipientInputControl.value).toBe('');
  });

  it('showAddButton should be true only if recipientInputControl has non-empty trimmed value', () => {
    form = new FormGroup({});
    fixture = TestBed.createComponent(GroupChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    fixture.detectChanges();
    component.recipientInputControl.setValue('  ');
    expect(component.showAddButton).toBe(false);
    component.recipientInputControl.setValue('abc');
    expect(component.showAddButton).toBe(true);
  });

  it('onAddRecipient should add recipient and clear input', () => {
    form = new FormGroup({});
    fixture = TestBed.createComponent(GroupChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    fixture.detectChanges();
    component.recipientInputControl.setValue('newUser');
    component.onAddRecipient();
    expect(component.recipients).toContain('newUser');
    expect(form.get('recipients')?.value).toContain('newUser');
    expect(component.recipientInputControl.value).toBe('');
  });

  it('onAddRecipient should not add empty or whitespace recipient', () => {
    form = new FormGroup({});
    fixture = TestBed.createComponent(GroupChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    fixture.detectChanges();
    component.recipientInputControl.setValue('   ');
    component.onAddRecipient();
    expect(component.recipients).toEqual([]);
    expect(form.get('recipients')?.value).toEqual([]);
  });

  it('onRemoveRecipient should remove recipient at index', () => {
    form = new FormGroup({ recipients: new FormControl(['a', 'b', 'c']) });
    fixture = TestBed.createComponent(GroupChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    fixture.detectChanges();
    component.onRemoveRecipient(1);
    expect(component.recipients).toEqual(['a', 'c']);
    expect(form.get('recipients')?.value).toEqual(['a', 'c']);
  });

  it('should update recipients array directly when onRemoveRecipient is called', () => {
    form = new FormGroup({ recipients: new FormControl(['a', 'b', 'c']) });
    fixture = TestBed.createComponent(GroupChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    component.recipients = ['x', 'y', 'z'];
    component.onRemoveRecipient(1);
    expect(component.recipients).toEqual(['x', 'z']);
  });

  it('should set recipients to [] if recipients control value is undefined', () => {
    form = new FormGroup({ recipients: new FormControl(undefined) });
    fixture = TestBed.createComponent(GroupChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    fixture.detectChanges();
    expect(component.recipients).toEqual([]);
  });

  it('should set recipients to [] if recipients control value is null', () => {
    form = new FormGroup({ recipients: new FormControl(null) });
    fixture = TestBed.createComponent(GroupChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    fixture.detectChanges();
    expect(component.recipients).toEqual([]);
  });

  it('should set recipients to [] if recipients control value is []', () => {
    form = new FormGroup({ recipients: new FormControl([]) });
    fixture = TestBed.createComponent(GroupChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    fixture.detectChanges();
    expect(component.recipients).toEqual([]);
  });

  it('onAddRecipient should not throw or add if recipientInputControl.value is null', () => {
    form = new FormGroup({});
    fixture = TestBed.createComponent(GroupChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    fixture.detectChanges();
    component.recipientInputControl.setValue(null);
    expect(() => component.onAddRecipient()).not.toThrow();
    expect(component.recipients).toEqual([]);
    expect(form.get('recipients')?.value).toEqual([]);
  });

  it('onAddRecipient should not add duplicate recipient', () => {
    form = new FormGroup({ recipients: new FormControl(['user1']) });
    fixture = TestBed.createComponent(GroupChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    fixture.detectChanges();
    component.recipientInputControl.setValue('user1');
    component.onAddRecipient();
    expect(component.recipients).toEqual(['user1']);
    expect(form.get('recipients')?.value).toEqual(['user1']);
  });
});
