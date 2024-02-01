import { io, Socket } from 'socket.io-client';
import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../src/components/AppContext';
import { MessagePayload, SocketPayload } from './lib/types';

export function MainScreen() {
  const [socket, setSocket] = useState<Socket>();
  const [message, setMessage] = useState('');
  const [convos, setConvos] = useState('');
  const [currentConvo, setCurrentConvo] = useState('');
  const [chat, setChat] = useState('');
  const [friendsList, setFriendsList] = useState([]);
  const [convosLoaded, setConvosLoaded] = useState(false);
  const [friendsLoaded, setFriendsLoaded] = useState(false);
  const [chatLoaded, setChatLoaded] = useState(false);
  const [messageReceived, setMessageReceived] = useState(false);
  const appContext = useContext(AppContext);

  useEffect(() => {
    //Load Conversations on mount
    async function getConversations() {
      try {
        const res = await fetch(
          `/api/pigeon/conversations/${appContext.user?.userID}`
        );
        const convos = await res.json();
        console.log('convos', convos);
        const temp = convos.map((convo) => (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setCurrentConvo(convo.conversationID)}>
            {convo.conversationID}
          </button>
        ));
        setConvos(temp);
        setConvosLoaded(true);
      } catch (err) {
        console.log(err);
      }
    }

    //Load Friends List on mount
    async function getFriends() {
      try {
        const res = await fetch(
          `/api/pigeon/friendships/${appContext.user?.userID}`
        );
        //
        const friends = await res.json();
        //userID, firstName, lastName, username, add types later
        const temp = friends.map((friend) => <li>{friend.firstName}</li>);
        setFriendsList(temp);
        console.log('friends', temp);
        setFriendsLoaded(true);
      } catch (err) {
        console.log(err);
      }
    }
    getFriends();
    getConversations();
    //Initialize socket on mount
    setSocket(io('http://localhost:8080'));
    return () => {
      socket?.disconnect();
      setSocket(undefined);
    };
  }, []);

  //Add event listeners to socket
  useEffect(() => {
    //send userID to server
    if (!socket) return;
    socket.on('socket-init-request', () => {
      const payload = { userID: appContext.user?.userID, socketID: socket.id };
      socket.emit('socket-init-response', payload);
    });
    //Refresh chat if receive server update if current convo
    socket.on('message-received', (convoID) => {
      console.log('current convo', currentConvo);
      console.log('convoID', convoID);

      if (currentConvo === convoID) {
        console.log('def received');
        setMessageReceived((prev) => !prev);
      }
    });
    socket.onAny((event) => {
      console.log('listened to event: ', event);
    });
    return () => {
      socket.off();
    };
  }, [socket, currentConvo]);

  //Load chat everytime convo view is changed or update received
  useEffect(() => {
    //Load chat from current convo
    console.log('should get chat');
    async function getChat() {
      try {
        const res = await fetch(`/api/pigeon/messages/${currentConvo}`);
        const messages = await res.json();
        const temp = messages.map((msg) => <li>{msg.messageContent}</li>);
        setChat(temp);
        setChatLoaded(true);
      } catch (err) {
        console.log(err);
      }
    }
    if (currentConvo) {
      getChat();
    }
  }, [currentConvo, messageReceived]);

  //Send message with message payload
  function handleClick() {
    const payload = {
      ...appContext.user,
      conversationID: currentConvo,
      messageContent: message,
    };
    socket?.emit('chat-message', payload);
    setMessage('');
  }

  //Load page after convos and friendsList loaded.
  if (!(convosLoaded && friendsLoaded)) return null;

  function messageStuff() {
    return (
      <>
        <h1 className="font-bold">Send a Message</h1>
        <input
          className="input input-bordered"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}></input>
        <button
          className="btn btn-primary"
          onClick={() => message && handleClick()}>
          click me
        </button>
        <h1 className="font-bold">Chat Log</h1>
        <ol>{chat}</ol>
      </>
    );
  }
  return (
    <div>
      <h1 className="font-bold">Current Conversation</h1>
      <span className="bg-yellow-400">{currentConvo || 'none'}</span>
      <h1 className="font-bold">Conversations</h1>
      <ol>{convos}</ol>
      <h1 className="font-bold">Friends</h1>
      <ol>{friendsList}</ol>
      {currentConvo && messageStuff()}
    </div>
  );
}
