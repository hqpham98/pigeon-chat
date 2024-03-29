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

export type Person = {
  //add display name later
  userID: number;
  username: string;
  firstName: string;
  lastName: string;
};

export type Message = {
  messageID: string;
  messageContent: string;
  userID: number;
  username: string;
  firstName: string;
  lastName: string;
  timestamp: string;
};

export type Conversation = {
  //add conversationName later
  conversationID: string;
  participants: Person[];
};

export type ConversationID = string;

export type ConversationIDObject = {
  conversationID: string;
};

export type UserIDObject = {
  userID: number;
};
export type View = 'Chats' | 'Friends' | 'Requests';

export type FriendRequest = {
  senderID: number;
  username: string;
  firstName: string;
  lastName: string;
};
