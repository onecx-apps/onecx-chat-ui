export interface NavigatorState {
  currentPage: 'chatList' | 'chat' | 'newChat' | null;
}

export const initialNavigatorState: NavigatorState = {
  currentPage: null,
};
