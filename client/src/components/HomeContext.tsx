import { createContext } from 'react';
import { ConversationID, Conversation, Friend } from '../lib/types';

export type HomeContextValues = {
  currentChat: ConversationID;
  chats: Conversation[];
  friends: Friend[];
  currentChatLoaded: boolean;
  chatsLoaded: boolean;
  friendsLoaded: boolean;
  messageEvent: boolean;
  setCurrentChat: (x: ConversationID) => void;
};

export const HomeContext = createContext<HomeContextValues>({
  currentChat: '',
  chats: [],
  friends: [],
  currentChatLoaded: false,
  chatsLoaded: false,
  friendsLoaded: false,
  messageEvent: false,
  setCurrentChat: () => undefined,
});
