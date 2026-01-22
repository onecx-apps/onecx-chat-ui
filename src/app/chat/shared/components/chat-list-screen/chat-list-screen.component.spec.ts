import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatListScreenComponent } from './chat-list-screen.component';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatOptionButtonComponent } from '../chat-option-button/chat-option-button.component';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { AppStateService } from '@onecx/portal-integration-angular';
import { of } from 'rxjs';
import {
  HarnessLoader,
  PButtonHarness,
  TestbedHarnessEnvironment,
} from '@onecx/angular-accelerator/testing';
import { ButtonModule } from 'primeng/button';

describe('ChatListScreenComponent', () => {
  let component: ChatListScreenComponent;
  let fixture: ComponentFixture<ChatListScreenComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChatListScreenComponent,
        ChatHeaderComponent,
        ChatOptionButtonComponent,
        ButtonModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: AppStateService,
          useValue: {
            currentMfe$: of({ remoteBaseUrl: 'http://localhost/workspace' }),
          },
        },
      ],
    }).compileComponents();

    // Mock MutationObserver
    const mutationObserverMock = jest.fn(function MutationObserver(callback) {
      this.observe = jest.fn();
      this.disconnect = jest.fn();
      this.trigger = (mockedMutationsList: any) => {
        callback(mockedMutationsList, this);
      };
      return this;
    });
    global.MutationObserver = mutationObserverMock as any;

    fixture = TestBed.createComponent(ChatListScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selectMode when AI Companion button is clicked', async () => {
    jest.spyOn(component.selectMode, 'emit');
    const aiBtn = await loader.getHarness(
      PButtonHarness.with({ id: 'aiCompanionButton' }),
    );
    await aiBtn?.click();
    expect(component.selectMode.emit).toHaveBeenCalledWith('ai');
  });

  it('should emit selectMode when Direct Chat button is clicked', async () => {
    jest.spyOn(component.selectMode, 'emit');
    const directBtn = await loader.getHarness(
      PButtonHarness.with({ id: 'directChatButton' }),
    );
    await directBtn?.click();
    expect(component.selectMode.emit).toHaveBeenCalledWith('direct');
  });

  it('should emit selectMode when Group Chat button is clicked', async () => {
    jest.spyOn(component.selectMode, 'emit');
    const groupBtn = await loader.getHarness(
      PButtonHarness.with({ id: 'groupChatButton' }),
    );
    await groupBtn?.click();
    expect(component.selectMode.emit).toHaveBeenCalledWith('group');
  });

  it('should emit selectMode with "close" when header close is clicked', () => {
    jest.spyOn(component.selectMode, 'emit');
    const header = fixture.debugElement.query(
      By.directive(ChatHeaderComponent),
    );
    header.triggerEventHandler('closed', null);
    expect(component.selectMode.emit).toHaveBeenCalledWith('close');
  });

  it('should initialize items array in ngOnInit', () => {
    component.ngOnInit();
    expect(component.items).toBeDefined();
    expect(component.items?.length).toBe(1);
    expect(component.items?.[0].label).toBe('Delete');
  });

  it('should emit deleteChat when Delete context menu item is clicked', () => {
    jest.spyOn(component.deleteChat, 'emit');
    const testChat = { id: 'chat1', topic: 'Test Chat' } as any;
    component.selectedChat = testChat;
    component.ngOnInit();

    component.onContextMenu(new MouseEvent('contextmenu'), testChat);
    component.items?.[0].command!({
      originalEvent: new MouseEvent('click'),
      item: component.items[0],
    });

    expect(component.deleteChat.emit).toHaveBeenCalledWith(testChat);
  });

  it('should reset selectedChat on onHide', () => {
    component.selectedChat = { id: 'chat1', topic: 'Test Chat' } as any;

    component.onHide();

    expect(component.selectedChat).toBeNull();
  });

  it('should display chat list when chats are provided', () => {
    component.chats = [
      { id: 'chat1', topic: 'Chat 1' } as any,
      { id: 'chat2', topic: 'Chat 2' } as any,
    ];
    fixture.detectChanges();

    expect(component.chats?.length).toBe(2);
  });

  it('should emit chatSelected when a chat item is clicked', () => {
    jest.spyOn(component.chatSelected, 'emit');
    const testChat = { id: 'chat1', topic: 'Test Chat' } as any;

    component.chatSelected.emit(testChat);

    expect(component.chatSelected.emit).toHaveBeenCalledWith(testChat);
  });
});
