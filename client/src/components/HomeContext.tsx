import { createContext } from 'react';
import { ConversationID, Conversation, Friend, Message } from '../lib/types';

export type HomeContextValues = {
  message: string;
  currentChat: ConversationID;
  currentMessages: Message[];
  chats: Conversation[];
  friends: Friend[];
  currentChatLoaded: boolean;
  chatsLoaded: boolean;
  friendsLoaded: boolean;
  messageEvent: boolean;
  setCurrentChat: (x: ConversationID) => void;
};

export const HomeContext = createContext<HomeContextValues>({
  message: '',
  currentChat: '',
  currentMessages: [],
  chats: [],
  friends: [],
  currentChatLoaded: false,
  chatsLoaded: false,
  friendsLoaded: false,
  messageEvent: false,
  setCurrentChat: () => undefined,
});
