import { chatAssistantReducer, initialState } from './chat-assistant.reducers';
import { ChatAssistantActions } from './chat-assistant.actions';
import { MessageType, Chat, ChatType } from 'src/app/shared/generated';

describe('chatAssistantReducer', () => {
  it('should return initial state when called with undefined', () => {
    const state = chatAssistantReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle chatsLoaded', () => {
    const chats: Chat[] = [{ id: '1', topic: 'Test', type: ChatType.HumanChat }];
    const action = ChatAssistantActions.chatsLoaded({ chats });
    const state = chatAssistantReducer(initialState, action);
    expect(state.chatList.chats).toEqual(chats);
    expect(state.chatList.isLoadingChats).toBe(false);
    expect(state.chatList.chatsError).toBeNull();
  });

  it('should handle chatsLoadingFailed', () => {
    const error = 'error';
    const action = ChatAssistantActions.chatsLoadingFailed({ error });
    const state = chatAssistantReducer(initialState, action);
    expect(state.chatList.isLoadingChats).toBe(false);
    expect(state.chatList.chatsError).toBe(error);
  });

  it('should handle chatChosen', () => {
    const action = ChatAssistantActions.chatChosen({ chatId: '123' });
    const state = chatAssistantReducer(initialState, action);
    expect(state.chat.chatId).toBe('123');
    expect(state.chat.isLoadingMessages).toBe(true);
    expect(state.chat.messageError).toBeNull();
  });

  it('should handle chatDetailsReceived', () => {
    const action = ChatAssistantActions.chatDetailsReceived({ chat: { id: '1', type: ChatType.HumanChat }, messages: [{ id: 'm1', text: 'msg', type: MessageType.Human }] });
    const state = chatAssistantReducer(initialState, action);
    expect(state.chat.chatId).toBe('1');
    expect(state.chat.messages).toEqual([{ id: 'm1', text: 'msg', type: MessageType.Human }]);
    expect(state.chat.isLoadingMessages).toBe(false);
    expect(state.chat.messageError).toBeNull();
    expect(state.chat.settings?.chatName).toBeUndefined();
  });

  it('should handle chatDetailsReceived with undefined id', () => {
    const action = ChatAssistantActions.chatDetailsReceived({ chat: { id: undefined, type: ChatType.HumanChat }, messages: [{ id: 'm1', text: 'msg', type: MessageType.Human }] });
    const state = chatAssistantReducer(initialState, action);
    expect(state.chat.chatId).toBeNull();
  });

  it('should handle chatDetailsLoadingFailed', () => {
    const action = ChatAssistantActions.chatDetailsLoadingFailed({ error: 'err' });
    const state = chatAssistantReducer(initialState, action);
    expect(state.chat.isLoadingMessages).toBe(false);
    expect(state.chat.messageError).toBe('err');
  });

  it('should handle messageSent', () => {
    const action = ChatAssistantActions.messageSent({ message: 'hello' });
    const prevState = {
      ...initialState,
      chat: { ...initialState.chat, messages: [{ id: 'old', text: 'old', type: MessageType.Human }] }
    };
    const state = chatAssistantReducer(prevState, action);
    expect(state.chat.messages[0].type).toBe(MessageType.Human);
    expect(state.chat.messages[0].text).toBe('hello');
    expect(state.chat.messages[1].type).toBe(MessageType.Assistant);
    expect(state.chat.messages.some(m => m.id === 'old')).toBe(true);
  });

  it('should handle messageSendingFailed', () => {
    const action = ChatAssistantActions.messageSendingFailed({ message: 'fail', error: null });
    const prevState = {
      ...initialState,
      chat: { ...initialState.chat, messages: [{ id: 'old', text: 'old', type: MessageType.Human }] }
    };
    const state = chatAssistantReducer(prevState, action);
    expect(state.chat.messages[0].type).toBe(MessageType.Human);
    expect(state.chat.messages[0].text).toBe('fail');
    expect(state.chat.messages.some(m => m.id === 'old')).toBe(true);
  });

  it('should handle messagesLoaded', () => {
    const action = ChatAssistantActions.messagesLoaded({ messages: [
      { id: 'msg1', text: 'msg1', type: MessageType.Human },
      { id: 'msg2', text: 'msg2', type: MessageType.Assistant }
    ] });
    const state = chatAssistantReducer(initialState, action);
    expect(state.chat.messages).toEqual([
      { id: 'msg1', text: 'msg1', type: MessageType.Human },
      { id: 'msg2', text: 'msg2', type: MessageType.Assistant }
    ]);
  });

  it('should handle chatSelected', () => {
    const action = ChatAssistantActions.chatSelected({ chat: { id: '2', type: ChatType.HumanChat } });
    const state = chatAssistantReducer(initialState, action);
    expect(state.chat.chatId).toBe('2');
    expect(state.chat.messages).toEqual([]);
    expect(state.chat.settings?.chatName).toBeUndefined();
  });

  it('should handle chatSelected with undefined id', () => {
    const action = ChatAssistantActions.chatSelected({ chat: { id: undefined, type: ChatType.HumanChat } });
    const state = chatAssistantReducer(initialState, action);
    expect(state.chat.chatId).toBeNull();
  });

  it('should handle messageSentForNewChat', () => {
    const action = ChatAssistantActions.messageSentForNewChat({ chat: { id: '3', type: ChatType.HumanChat }, message: 'test' });
    const state = chatAssistantReducer(initialState, action);
    expect(state.chat.chatId).toBe('3');
    expect(state.chat.settings?.chatName).toBeUndefined();
  });

  it('should handle messageSentForNewChat with undefined id', () => {
    const action = ChatAssistantActions.messageSentForNewChat({ chat: { id: undefined, type: ChatType.HumanChat }, message: 'test' });
    const state = chatAssistantReducer(initialState, action);
    expect(state.chat.chatId).toBeNull();
  });

  it('should handle chatCreationSuccessful', () => {
    const action = ChatAssistantActions.chatCreationSuccessful({ chat: { id: '4', type: ChatType.HumanChat } });
    const prevState = {
      ...initialState,
      chatList: { ...initialState.chatList, chats: [{ id: 'old', type: ChatType.HumanChat }] }
    };
    const state = chatAssistantReducer(prevState, action);
    expect(state.chat.chatId).toBe('4');
    expect(state.chat.messages).toEqual([]);
    expect(state.chatList.chats[0].id).toBe('4');
    expect(state.chatList.chats[1].id).toBe('old');
  });

  it('should handle chatCreationSuccessful with undefined id', () => {
    const action = ChatAssistantActions.chatCreationSuccessful({ chat: { id: undefined, type: ChatType.HumanChat } });
    const prevState = {
      ...initialState,
      chatList: { ...initialState.chatList, chats: [{ id: 'old', type: ChatType.HumanChat }] }
    };
    const state = chatAssistantReducer(prevState, action);
    expect(state.chat.chatId).toBeNull();
  });

  it('should handle chatDeletionSuccessful', () => {
    const action = ChatAssistantActions.chatDeletionSuccessful({ chatId: 'old' });
    const prevState = {
      ...initialState,
      chatList: { ...initialState.chatList, chats: [{ id: 'old', type: ChatType.HumanChat }, { id: 'keep', type: ChatType.HumanChat }] }
    };
    const state = chatAssistantReducer(prevState, action);
    expect(state.chat).toEqual(initialState.chat);
    expect(state.chatList.chats).toEqual([{ id: 'keep', type: ChatType.HumanChat }]);
  });

  it('should handle chatModeSelected', () => {
    const action = ChatAssistantActions.chatModeSelected({ mode: 'ai' });
    const state = chatAssistantReducer(initialState, action);
    expect(state.chatList.selectedChatMode).toBe('ai');
    expect(state.chat).toEqual(initialState.chat);
  });

  it('should handle chatModeDeselected', () => {
    const action = ChatAssistantActions.chatModeDeselected();
    const prevState = {
      ...initialState,
      chatList: { ...initialState.chatList, selectedChatMode: 'ai' }
    };
    const state = chatAssistantReducer(prevState, action);
    expect(state.chatList.selectedChatMode).toBeNull();
  });

  it('should handle chatPanelOpened', () => {
    const action = ChatAssistantActions.chatPanelOpened();
    const state = chatAssistantReducer(initialState, action);
    expect(state).toEqual(initialState);
  });

  it('should handle chatPanelClosed', () => {
    const action = ChatAssistantActions.chatPanelClosed();
    const prevState = {
      ...initialState,
      chatList: { ...initialState.chatList, selectedChatMode: 'ai' }
    };
    const state = chatAssistantReducer(prevState, action);
    expect(state.chatList.selectedChatMode).toBeNull();
  });

  it('should handle newChatButtonClicked', () => {
    const action = ChatAssistantActions.newChatButtonClicked();
    const prevState = {
      ...initialState,
      chat: { ...initialState.chat, chatId: 'old' }
    };
    const state = chatAssistantReducer(prevState, action);
    expect(state.chat).toEqual(initialState.chat);
  });

  it('should handle navigateToChatList', () => {
    const action = ChatAssistantActions.navigateToChatList();
    const state = chatAssistantReducer(initialState, action);
    expect(state).toEqual(initialState);
  });

  it('should handle chatCreateButtonClicked', () => {
    const action = ChatAssistantActions.chatCreateButtonClicked({
      chatName: 'TestChat',
      chatMode: 'ai',
      recipientUserId: 'user1',
      participants: ['user1', 'user2'],
    });
    const state = chatAssistantReducer(initialState, action);
    expect(state.chat.settings).not.toBeNull();
    expect(state.chat.settings?.chatName).toBe('TestChat');
    expect(state.chat.settings?.chatMode).toBe('ai');
    expect(state.chat.settings?.recipientUserId).toBe('user1');
    expect(state.chat.settings?.participants).toEqual(['user1', 'user2']);
  });

  it('should not change state for unknown action', () => {
    const prevState = { ...initialState, chat: { ...initialState.chat, chatId: 'x' } };
    const state = chatAssistantReducer(prevState, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(prevState);
  });
});