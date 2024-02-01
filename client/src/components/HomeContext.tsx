import { createContext } from 'react';
import { ConversationID, Conversation, Friend } from '../lib/types';

export type HomeContextValues = {
  currentChat: ConversationID;
  chats: Conversation[] | [];
  friends: Friend[] | [];
  currentChatLoaded: boolean;
  chatsLoaded: boolean;
  friendsLoaded: boolean;
  messageEvent: boolean;
};

export const HomeContext = createContext<HomeContextValues>({
  currentChat: '',
  chats: [],
  friends: [],
  currentChatLoaded: false,
  chatsLoaded: false,
  friendsLoaded: false,
  messageEvent: false,
});
