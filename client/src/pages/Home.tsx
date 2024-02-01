import { io, Socket } from 'socket.io-client';
import { useState, useEffect, useContext } from 'react';
import { View, ConversationID } from '../lib/types';
import { MainPanel } from '../components/MainPanel';
import { SidePanel } from '../components/SidePanel';
import { AppContext } from '../components/AppContext';
import { HomeContext, HomeContextValues } from '../components/HomeContext';

export function Home() {
  const [sideView, setSideView] = useState<View>('Chats');
  const [currentChat, setCurrentChat] = useState<ConversationID>('');
  const [chats, setChats] = useState([]); //create a conversationName in the db, not just id
  const [friends, setFriends] = useState([]);
  const [currentChatLoaded, setCurrentChatLoaded] = useState(false);
  const [chatsLoaded, setChatsLoaded] = useState(false);
  const [friendsLoaded, setFriendsLoaded] = useState(false);
  const [messageEvent, setMessageEvent] = useState(false); //Toggle triggers useEffects
  const [socket, setSocket] = useState<Socket>();
  const appContext = useContext(AppContext);

  //Initialize Socket on mount
  useEffect(() => {
    console.log('socket initialized');
    setSocket(io('http://localhost:8080'));
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
      const payload = { userID: appContext.user?.userID, socketID: socket.id };
      socket.emit('socket-init-response', payload);
    });
    //Toggle messageEvent to trigger chat reload useEffect if message is for the current chat
    socket.on('message-received', (convo: ConversationID) => {
      if (currentChat === convo) {
        setMessageEvent((prev) => !prev);
      }
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
        const convos = await res.json();
        const temp = convos.map((convo) => (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setCurrentChat(convo.conversationID)}>
            {convo.conversationID}
          </button>
        ));
        setChats(temp);
        setChatsLoaded(true);
        console.log('hi');
      } catch (err) {
        //Fix error reporting
        console.log(err);
      }
    }
    getChats();
    if (currentChat) getChats();
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
        console.log('friends', friends);
        //userID, firstName, lastName, username, add types later
        const temp = friends.map((friend) => <li>{friend.firstName}</li>);
        setFriends(temp);
        setFriendsLoaded(true);
      } catch (err) {
        //Fix error reporting
        console.log(err);
      }
    }
    getFriends();
  }, []);

  //Reload chat everytime current conversation view is changed or messageEvent toggled.
  useEffect(() => {
    //Load chat from current convo
    async function getCurrentChat() {
      console.log('getCurrentChat ran');
      try {
        const res = await fetch(`/api/pigeon/messages/${currentChat}`);
        const messages = await res.json();
        console.log('messages', messages);
        const temp = messages.map((msg) => <li>{msg.messageContent}</li>);
        setCurrentChat(temp);
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
    currentChat,
    chats,
    friends,
    currentChatLoaded,
    chatsLoaded,
    friendsLoaded,
    messageEvent,
  };
  return (
    <HomeContext.Provider value={contextValue}>
      <div className="flex">
        <div className="bg-[#282B30] min-w-96  w-screen  sm:w-96  min-h-screen">
          <SidePanel view={sideView} changeView={(v: View) => setSideView(v)} />
        </div>
        <div className="bg-[#34373C] sm:w-full ">
          <MainPanel conversationID={currentChat} />
        </div>
      </div>
    </HomeContext.Provider>
  );
}