export type Message = {
  userID: number;
  username: string;
  conversationID: string;
  messageContent: string;
};

export type SocketClientDict = Record<string, number>;
export type FriendRequest = {
  senderID: number;
  receiverID: number;
};

export type RequestDecision = {
  decision: 'accept' | 'reject';
  senderID: number;
  receiverID: number;
};
