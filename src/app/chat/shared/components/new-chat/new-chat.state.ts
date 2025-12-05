export interface NewChatState {
  direct: {
    chatName: string;
    recipientInput: string;
  };
  group: {
    chatName: string;
    recipientInput: string;
    recipients: string[];
  };
  ai: {
    chatName: string;
  };
}

export const initialNewChatState: NewChatState = {
  direct: {
    chatName: '',
    recipientInput: ''
  },
  group: {
    chatName: '',
    recipientInput: '',
    recipients: []
  },
  ai: {
    chatName: ''
  }
};
