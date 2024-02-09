import { createContext } from 'react';
import {
  ConversationID,
  Conversation,
  Friend,
  FriendRequest,
  Message,
} from '../lib/types';
import { Socket } from 'socket.io-client';

export type HomeContextValues = {
  message: string;
  setMessage: (x: string) => void;
  currentChat: ConversationID;
  currentMessages: Message[];
  chats: Conversation[];
  friends: Friend[];
  friendRequests: FriendRequest[];
  currentChatLoaded: boolean;
  chatsLoaded: boolean;
  friendsLoaded: boolean;
  messageEvent: boolean;
  setCurrentChat: (x: ConversationID) => void;
  socket: Socket | undefined;
};

export const HomeContext = createContext<HomeContextValues>({
  message: '',
  setMessage: () => undefined,
  currentChat: '',
  currentMessages: [],
  chats: [],
  friends: [],
  friendRequests: [],
  currentChatLoaded: false,
  chatsLoaded: false,
  friendsLoaded: false,
  messageEvent: false,
  setCurrentChat: () => undefined,
  socket: undefined,
});
