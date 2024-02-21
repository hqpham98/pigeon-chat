import { io, Socket } from 'socket.io-client';
import { useState, useEffect, useContext } from 'react';
import {
  View,
  ConversationID,
  ConversationIDObject,
  SocketPayload,
  FriendRequest,
  Conversation,
  Person,
} from '../lib/types';
import { MainPanel } from '../components/MainPanel';
import { SidePanel } from '../components/SidePanel';
import { AppContext } from '../components/AppContext';
import { HomeContext, HomeContextValues } from '../components/HomeContext';

export function Home() {
  const [sideView, setSideView] = useState<View>('Chats');
  const [message, setMessage] = useState('');
  const [currentMessages, setCurrentMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState<ConversationID>('');
  const [chats, setChats] = useState<Conversation[]>([]); //create a conversationName in the db, not just id
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [currentChatLoaded, setCurrentChatLoaded] = useState(false);
  const [chatsLoaded, setChatsLoaded] = useState(false);
  const [friendsLoaded, setFriendsLoaded] = useState(false);
  const [requestReceived, setRequestReceived] = useState(false); //Toggle triggers useEffects
  const [messageEvent, setMessageEvent] = useState(false); //Toggle triggers useEffects
  const [friendEvent, setFriendEvent] = useState(false); //Toggle triggers useEffects
  const [convoEvent, setConvoEvent] = useState(false); //Toggle triggers useEffects
  const [socket, setSocket] = useState<Socket>();
  const appContext = useContext(AppContext);

  /**
   * Initialize Socket on mount
   */
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      setSocket(io());
    } else {
      setSocket(io('http://localhost:8080'));
    }

    return () => {
      socket?.disconnect();
      setSocket(undefined);
    };
  }, []);

  /**
   * Define Socket Event Handlers
   */
  useEffect(() => {
    /**
     * socket-init-request
     * Send userID to Socket server
     */
    if (!socket) return;
    socket.on('socket-init-request', () => {
      if (!appContext.user || !socket.id) return;
      const payload: SocketPayload = {
        userID: appContext.user.userID,
        socketID: socket.id,
      };
      socket.emit('socket-init-response', payload);
    });
    /**
     * message-received
     * Toggle messageEvent state to trigger useEffect for chat reload if the message is for the current convo
     */
    socket.on('message-received', (convo: ConversationID) => {
      if (currentChat === convo) {
        setMessageEvent((prev) => !prev);
      }
    });
    /**
     * friend-request-received
     * Toggle setRequestReceived state to trigger useEffect for friend request list reload
     */
    socket.on('friend-request-received', () => {
      setRequestReceived((prev) => !prev);
    });
    /**
     * friend-list-update
     * Toggle setFriendEvent state to trigger useEffect for friend list reload
     */
    socket.on('friend-list-update', () => {
      setFriendEvent((prev) => !prev);
    });
    /**
     * friend-request-update
     * Toggle setRequestReceived state to trigger useEffect for friend request list reload
     */
    socket.on('friend-request-update', () => {
      setRequestReceived((prev) => !prev);
    });

    /**
     * conversation-created
     * Toggle setConvoEvent state to trigger useEffect for conversation list reload
     */
    socket.on('conversation-created', (convo: ConversationID) => {
      setCurrentChat(convo);
      setConvoEvent((prev) => !prev);
    });

    /**
     * conversation-list-update
     * Toggle setConvoEvent state to trigger useEffect for conversation list reload
     */

    socket.on('conversation-list-update', () => {
      setConvoEvent((prev) => !prev);
    });

    return () => {
      socket.off();
    };
  }, [socket, currentChat]);

  /**
   * Load conversations on mount and on conversation events.
   */
  useEffect(() => {
    async function getChats() {
      try {
        const res = await fetch(
          `/api/pigeon/conversations/conversationids/${appContext.user?.userID}`
        );
        const convoIDList: ConversationIDObject[] = await res.json();
        const conversationsList: Conversation[] = [];
        for (let i = 0; i < convoIDList.length; i++) {
          const res = await fetch(
            `/api/pigeon/conversations/participants/${convoIDList[i].conversationID}`
          );
          const participants: Person[] = await res.json();
          conversationsList.push({
            conversationID: convoIDList[i].conversationID,
            participants,
          });
        }
        setChats(conversationsList);
        setChatsLoaded(true);
      } catch (err) {
        console.log(err);
      }
    }
    getChats();
  }, [convoEvent]);

  /**
   * Load Friends List on mount or friendEvent toggled
   */
  useEffect(() => {
    async function getFriends() {
      try {
        const res = await fetch(
          `/api/pigeon/friendships/${appContext.user?.userID}`
        );
        const friends = await res.json();
        setFriends(friends);
        setFriendsLoaded(true);
      } catch (err) {
        console.log(err);
      }
    }
    getFriends();
  }, [friendEvent]);

  /**
   * Load Friend Requests list on mount or requestReceived toggled
   */
  useEffect(() => {
    async function getRequests() {
      try {
        const res = await fetch(
          `/api/pigeon/requests/${appContext.user?.userID}`
        );
        const requests: FriendRequest[] = await res.json();
        setFriendRequests(requests);
      } catch (err) {
        console.log(err);
      }
    }
    getRequests();
  }, [requestReceived]);

  /**
   * Reload chat everytime current conversation view is changed or messageEvent state is changed
   */
  useEffect(() => {
    //Load chat from current convo
    async function getCurrentChat() {
      try {
        const res = await fetch(`/api/pigeon/messages/${currentChat}`);
        const messages = await res.json();
        setCurrentMessages(messages);
        setCurrentChatLoaded(true);
      } catch (err) {
        console.log(err);
      }
    }
    getCurrentChat();
  }, [currentChat, messageEvent]);

  //Load page after convos and friendsList loaded.
  if (!(chatsLoaded && friendsLoaded)) return null;

  const contextValue: HomeContextValues = {
    message,
    setMessage,
    currentChat,
    currentMessages,
    chats,
    friends,
    friendRequests,
    currentChatLoaded,
    chatsLoaded,
    friendsLoaded,
    messageEvent,
    setCurrentChat,
    socket,
  };
  return (
    <HomeContext.Provider value={contextValue}>
      <div className="flex">
        <div className="bg-[#282B30] min-w-96  w-screen  sm:w-96  min-h-screen">
          <SidePanel view={sideView} changeView={(v: View) => setSideView(v)} />
        </div>
        <div className="bg-[#34373C] hidden sm:block sm:w-full ">
          <MainPanel />
        </div>
      </div>
    </HomeContext.Provider>
  );
}
