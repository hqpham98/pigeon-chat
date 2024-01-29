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

  useEffect(() => {
    async function getConversations() {
      const res = await fetch(
        `/api/pigeon/conversations/${appContext.user?.userID}`
      );
      const convos = JSON.parse(await res.json());
      const temp = convos.map((convo) => <li>conversationID: {convo}</li>);
      setConversations(temp);
      setConvLoaded(true);
    }
    // async function getChat() {
    //   const res = await fetch(
    //     `/api/pigeon/conversations/${appContext.user?.userID}`
    //   );
    // }

    async function getFriends() {}

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

  const appContext = useContext(AppContext);

  function handleClick() {
    socket?.emit(
      'message',
      `message sent from ${appContext.user?.username}: ${message}`
    );
    setMessage('');
  }

  if (!(convLoaded && chatLoaded)) return null;

  return (
    <div>
      <h1>Conversations</h1>
      <ol>{conversations}</ol>
      <h1>Friends</h1>
      <ol>{friends}</ol>
      <h1>Chat</h1>
      <ol>{chat}</ol>
      <h1>Messaging {}</h1>
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
