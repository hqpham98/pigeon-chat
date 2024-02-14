import { io, Socket } from 'socket.io-client';
import { useState, useEffect, useContext } from 'react';
import {
  View,
  ConversationID,
  SocketPayload,
  FriendRequest,
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
  const [chats, setChats] = useState([]); //create a conversationName in the db, not just id
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [currentChatLoaded, setCurrentChatLoaded] = useState(false);
  const [chatsLoaded, setChatsLoaded] = useState(false);
  const [friendsLoaded, setFriendsLoaded] = useState(false);
  const [requestReceived, setRequestReceived] = useState(false); //Toggle triggers useEffects
  const [messageEvent, setMessageEvent] = useState(false); //Toggle triggers useEffects
  const [socket, setSocket] = useState<Socket>();
  const appContext = useContext(AppContext);

  //Initialize Socket on mount
  useEffect(() => {
    console.log('socket initialized');
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

  //Add event listeners to socket
  useEffect(() => {
    console.log('added  event listeners to socket');
    //Send userID to socket server
    if (!socket) return;
    socket.on('socket-init-request', () => {
      if (!appContext.user || !socket.id) return;
      const payload: SocketPayload = {
        userID: appContext.user.userID,
        socketID: socket.id,
      };
      socket.emit('socket-init-response', payload);
    });
    //Toggle messageEvent to trigger chat reload useEffect if message is for the current chat
    socket.on('message-received', (convo: ConversationID) => {
      if (currentChat === convo) {
        setMessageEvent((prev) => !prev);
      }
    });
    socket.on('friend-request-received', () => {
      setRequestReceived((prev) => !prev);
    });
    //Log all socket events listened
    socket.onAny((event) => {
      console.log('listened to event: ', event);
    });
    return () => {
      socket.off();
    };
  }, [socket, currentChat]);

  //Load Conversations on mount
  useEffect(() => {
    async function getChats() {
      console.log('getChats ran');
      try {
        //Fix appContext type definitions later
        const res = await fetch(
          `/api/pigeon/conversations/${appContext.user?.userID}`
        );
        const chats = await res.json();
        setChats(chats);
        setChatsLoaded(true);
      } catch (err) {
        //Fix error reporting
        console.log(err);
      }
    }
    getChats();
  }, []);

  //Load Friends List on mount
  useEffect(() => {
    async function getFriends() {
      console.log('getFriends ran');
      try {
        const res = await fetch(
          `/api/pigeon/friendships/${appContext.user?.userID}`
        );
        //
        const friends = await res.json();
        setFriends(friends);
        setFriendsLoaded(true);
      } catch (err) {
        //Fix error reporting
        console.log(err);
      }
    }
    getFriends();
  }, []);

  //Load Friend Requests list on mount or requestReceived toggled
  useEffect(() => {
    async function getRequests() {
      console.log('getRequests ran');
      try {
        const res = await fetch(
          `/api/pigeon/requests/${appContext.user?.userID}`
        );
        const requests: FriendRequest[] = await res.json();
        setFriendRequests(requests);
      } catch (err) {}
    }
    getRequests();
  }, [requestReceived]);

  //Reload chat everytime current conversation view is changed or messageEvent toggled.
  useEffect(() => {
    //Load chat from current convo
    async function getCurrentChat() {
      console.log('getCurrentChat ran');
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
