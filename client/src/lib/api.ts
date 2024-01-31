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
