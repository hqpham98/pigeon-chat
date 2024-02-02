export type User = {
  userID: number;
  username: string;
};
export type Auth = {
  user: User;
  token: string;
};

export type MessagePayload = {
  userID: number;
  username: string;
  conversationID: string;
};

export type SocketPayload = {
  userID: number;
  socketID: string;
};

export type Friend = {
  //add display name later
  userID: number;
  username: string;
  firstName: string;
  lastName: string;
};

export type Conversation = {
  //add conversationName later
  conversationID: string;
};
export type ConversationList = Conversation[];

export type ConversationID = string;

export type View = 'Chats' | 'Friends' | 'Requests';
