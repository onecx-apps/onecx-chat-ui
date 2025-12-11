import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedChatSettingsComponent } from './shared-chat-settings.component';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

class MockTranslateService {
  get(key: any) { return of(key); }
  instant(key: any) { return key; }
}

import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: any) { return value; }
}

describe('SharedChatSettingsComponent', () => {
  let component: SharedChatSettingsComponent;
  let fixture: ComponentFixture<SharedChatSettingsComponent>;
  let form: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedChatSettingsComponent, ReactiveFormsModule, MockTranslatePipe],
      providers: [
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    }).compileComponents();

    TestBed.overrideComponent(SharedChatSettingsComponent, {
      set: {
        imports: [
          ReactiveFormsModule,
          MockTranslatePipe
        ]
      }
    });
  });

  beforeEach(() => {
    form = new FormGroup({ chatName: new FormControl('test name') });
    fixture = TestBed.createComponent(SharedChatSettingsComponent);
    component = fixture.componentInstance;
    component.form = form;
    component.chatNamePlaceholder = 'placeholder';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have chatNamePlaceholder input', () => {
    expect(component.chatNamePlaceholder).toBe('placeholder');
  });

  it('chatNameControl getter should return the chatName control', () => {
    expect(component.chatNameControl).toBe(form.get('chatName'));
    expect(component.chatNameControl?.value).toBe('test name');
  });
});
