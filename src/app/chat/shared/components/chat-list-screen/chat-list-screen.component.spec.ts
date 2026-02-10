import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatListScreenComponent } from './chat-list-screen.component';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatOptionButtonComponent } from '../chat-option-button/chat-option-button.component';
import { By } from '@angular/platform-browser';
import { AppStateService } from '@onecx/portal-integration-angular';
import { of } from 'rxjs';
import {
  HarnessLoader,
  PButtonHarness,
  TestbedHarnessEnvironment,
} from '@onecx/angular-accelerator/testing';
import { ButtonModule } from 'primeng/button';
import { TranslateTestingModule } from 'ngx-translate-testing';

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
        TranslateTestingModule.withTranslations(
          'en',
          // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
          require('../../../../../assets/i18n/en.json'),
          // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        ).withTranslations('de', require('../../../../../assets/i18n/de.json')),
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

  describe('formatLastMessageTime', () => {
    it('should return time in h:mm a format for messages less than 1 day old', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      
      const result = component.formatLastMessageTime(oneHourAgo);
      
      expect(result).toMatch(/\d{1,2}:\d{2}\s(AM|PM)/);
    });

    it('should return "Yesterday" translation for messages from yesterday', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      
      jest.spyOn(component['translate'], 'instant').mockReturnValue('Yesterday');
      const result = component.formatLastMessageTime(yesterday);
      
      expect(result).toBe('Yesterday');
      expect(component['translate'].instant).toHaveBeenCalledWith('CHAT.TIME.YESTERDAY');
    });

    it('should return translated day name for messages from last 7 days', () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
      
      jest.spyOn(component['translate'], 'instant').mockReturnValue('Wednesday');
      const result = component.formatLastMessageTime(threeDaysAgo);
      
      expect(result).toBe('Wednesday');
      expect(component['translate'].instant).toHaveBeenCalled();
    });

    it('should return empty string when datePipe.transform returns empty for time format', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      
      jest.spyOn(component['datePipe'], 'transform').mockReturnValue(null);
      const result = component.formatLastMessageTime(oneHourAgo);
      
      expect(result).toBe('');
    });

    it('should return empty string when datePipe.transform returns empty for day name', () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
      
      jest.spyOn(component['datePipe'], 'transform').mockReturnValue(null);
      const result = component.formatLastMessageTime(twoDaysAgo);
      
      expect(result).toBe('');
    });

    it('should return empty string when datePipe.transform returns empty for date format', () => {
      const now = new Date();
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();
      
      jest.spyOn(component['datePipe'], 'transform').mockReturnValue(null);
      const result = component.formatLastMessageTime(tenDaysAgo);
      
      expect(result).toBe('');
    });
  });
});
