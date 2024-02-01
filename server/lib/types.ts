export type Message = {
  userID: number;
  username: string;
  conversationID: string;
  messageContent: string;
};

export type SocketClientDict = Record<string, number>;
