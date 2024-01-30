import { io, Socket } from 'socket.io-client';
import { useEffect, useState, useContext, useCallback } from 'react';
import { AppContext } from '../src/components/AppContext';

export function MainScreen() {
  const [socket, setSocket] = useState<Socket>();
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState('');
  const [chat, setChat] = useState('');
  const [friends, setFriends] = useState('');
  const [convLoaded, setConvLoaded] = useState(false);
  const [chatLoaded, setChatLoaded] = useState(false);
  const appContext = useContext(AppContext);

  useEffect(() => {
    async function getConversations() {
      try {
        const res = await fetch(
          `/api/pigeon/conversations/${appContext.user?.userID}`
        );
        const convos = await res.json();
        console.log('convos', convos);
        const temp = convos.map((convo) => <li>{convo.conversationID}</li>);
        setConversations(temp);
        setConvLoaded(true);
      } catch (err) {
        console.log(err);
      }
    }
    async function getFriends() {}
    getConversations();
    setSocket(io('http://localhost:8080'));
    if (socket) {
      socket.io.on('error', (error) => {
        console.log(error);
      });
    }
    return () => {
      socket?.disconnect();
    };
  }, []);

  function handleClick() {
    socket?.emit(
      'message',
      `message sent from ${appContext.user?.username}: ${message}`
    );
    setMessage('');
  }

  if (!convLoaded) return null;

  return (
    <div>
      <h1 className="font-bold">Conversations</h1>
      <ol>{conversations}</ol>
      <h1 className="font-bold">Friends</h1>
      <ol>{friends}</ol>
      <h1 className="font-bold">Chat</h1>
      <ol>{chat}</ol>
      <h1 className="font-bold">Messaging {}</h1>
      <input
        className="input input-bordered"
        name="message"
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}></input>
      <button className="btn btn-primary" onClick={() => handleClick()}>
        click me
      </button>
    </div>
  );
}
