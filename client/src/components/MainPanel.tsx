import { useContext, useEffect, useState } from 'react';
import { HomeContext, HomeContextValues } from './HomeContext';
import { Conversation, Message } from '../lib/types';
import { AppContext, AppContextValues } from './AppContext';

export function MainPanel() {
  const homeContext: HomeContextValues = useContext(HomeContext);
  const appContext = useContext(AppContext);
  const [chatName, setChatName] = useState('');
  const { currentChat, chats } = homeContext;

  useEffect(() => {
    const current = chats.filter((chat: Conversation) => {
      return currentChat === chat.conversationID;
    })[0];

    if (current) {
      const user1 = current.participants[0];
      const user2 = current.participants[1];
      if (user1.userID === appContext.user?.userID) {
        setChatName(`${user2.firstName} ${user2.lastName}`);
      } else {
        setChatName(`${user1.firstName} ${user1.lastName}`);
      }
    }
  }, [currentChat, chats]);

  return (
    //Container
    <div>
      {/* Header */}
      <div className="flex h-14 py-2 px-4 border-solid border-[#2E3034] border-b-2 ">
        <h1 className="text-white font-bold text-2xl basis-[50%] self-center">
          {chatName}
        </h1>
      </div>
      {/* Panel Body */}
      <div className="min-h-96 h-[calc(100vh-3.5rem)] flex flex-col">
        <MessageArea />
        <InputArea chatName={chatName} />
      </div>
    </div>
  );
}

function MessageArea() {
  const homeContext: HomeContextValues = useContext(HomeContext);
  const { currentMessages } = homeContext;
  const result = currentMessages.map((msg: Message) => (
    <div className="text-white" key={msg.messageID}>
      {msg.messageContent}
    </div>
  ));
  return (
    <div className="h-full overflow-auto p-4">
      <ol>{result}</ol>
    </div>
  );
}
type InputProps = {
  chatName: string;
};
function InputArea({ chatName }: InputProps) {
  const appContext: AppContextValues = useContext(AppContext);
  const homeContext: HomeContextValues = useContext(HomeContext);
  const { currentChat, message, setMessage, socket } = homeContext;

  function sendMessage() {
    const payload = {
      ...appContext.user,
      conversationID: currentChat,
      messageContent: message,
    };
    socket?.emit('chat-message', payload);
    setMessage('');
  }
  return (
    <div className="min-h-[4.5rem] flex p-4">
      <input
        type="text"
        placeholder={chatName && `Message ${chatName}`}
        onChange={(event) => {
          setMessage(event.currentTarget.value);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.currentTarget.value = '';
            sendMessage();
          }
        }}
        className="bg-[#424549] placeholder:text-[#ADADAD] text-white p-2 h-full m-auto w-full rounded focus:outline-none"></input>
    </div>
  );
}
