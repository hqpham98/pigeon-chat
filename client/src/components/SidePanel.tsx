import {
  FaUserGroup,
  FaPenToSquare,
  FaRegMessage,
  FaRegBell,
  FaUserPlus,
  FaCheck,
  FaXmark,
} from 'react-icons/fa6';
import { View, Conversation, Person, FriendRequest } from '../lib/types';
import { HomeContext, HomeContextValues } from './HomeContext';
import { AddFriendModal } from './AddFriendModal';
import { NewMessageModal } from './NewMessageModal';
import { useContext, useState } from 'react';
import { AppContext, AppContextValues } from './AppContext';

type SideProps = {
  view: View;
  changeView: (v: View) => void;
};

export function SidePanel({ view, changeView }: SideProps) {
  const [viewFriendModal, setViewFriendModal] = useState(false);
  const [viewMessageModal, setViewMessageModal] = useState(false);

  return (
    // Container
    <div>
      {viewFriendModal && <AddFriendModal viewModal={setViewFriendModal} />}
      {viewMessageModal && <NewMessageModal viewModal={setViewMessageModal} />}
      {/* Header */}
      <div className="h-14 py-2 px-4 border-solid border-[#2E3034] border-b-2 flex">
        <h1 className="text-white font-bold text-2xl basis-[50%] self-center">
          {view}
        </h1>
        {/* Header Button Container */}
        <div className="flex basis-[50%] justify-end">
          <HeaderButtons
            view={view}
            changeView={changeView}
            friendModalView={setViewFriendModal}
            messageModalView={setViewMessageModal}
          />
        </div>
      </div>
      {/* Panel Body */}
      <div className="py-2 px-4 overflow-auto">
        <PanelBody view={view} />
      </div>
      {/* Add Friend Modal */}
    </div>
  );
}

type HeaderProps = {
  view: View;
  changeView: (v: View) => void;
  friendModalView: (x: boolean) => void;
  messageModalView: (x: boolean) => void;
};

function HeaderButtons({
  view,
  changeView,
  friendModalView,
  messageModalView,
}: HeaderProps) {
  if (view === 'Chats') {
    return (
      <>
        <FaUserGroup
          className="text-right cursor-pointer ml-4 text-2xl self-center"
          style={{ color: '#FFFFFF' }}
          onClick={() => changeView('Friends')}
          data-tip="hi"
        />
        <FaPenToSquare
          className=" cursor-pointer ml-4 text-2xl self-center"
          style={{ color: '#FFFFFF' }}
          onClick={() => messageModalView(true)}
        />
      </>
    );
  }
  if (view === 'Friends') {
    return (
      <>
        <FaRegBell
          className="cursor-pointer ml-4 text-2xl self-center"
          style={{ color: '#FFFFFF' }}
          onClick={() => changeView('Requests')}
        />
        <FaRegMessage
          className="cursor-pointer ml-4 text-2xl self-center"
          style={{ color: '#FFFFFF' }}
          onClick={() => changeView('Chats')}
        />
        <FaUserPlus
          className="cursor-pointer ml-4 text-2xl self-center"
          style={{ color: '#FFFFFF' }}
          onClick={() => friendModalView(true)}
        />
      </>
    );
  }
  if (view === 'Requests') {
    return (
      <>
        <FaUserGroup
          className="text-right cursor-pointer ml-4 text-2xl self-center"
          style={{ color: '#FFFFFF' }}
          onClick={() => changeView('Friends')}
        />
        <FaRegMessage
          className="cursor-pointer ml-4 text-2xl self-center"
          style={{ color: '#FFFFFF' }}
          onClick={() => changeView('Chats')}
        />
      </>
    );
  }
}

type BodyProps = {
  view: View;
};

function PanelBody({ view }: BodyProps) {
  const appContext: AppContextValues = useContext(AppContext);
  const userID = appContext.user?.userID;
  const homeContext: HomeContextValues = useContext(HomeContext);
  const {
    currentChat,
    chats,
    friends,
    friendRequests,
    setCurrentChat,
    socket,
  } = homeContext;

  if (view === 'Chats') {
    const result = chats.map((chat: Conversation) => (
      <div
        key={chat.conversationID}
        onClick={() => {
          setCurrentChat(chat.conversationID);
        }}
        className={
          'mx-auto basis-[100%] my-2 p-2 w-full font-medium text-[20px] rounded-md hover:bg-[#424549] hover:text-white cursor-pointer  ' +
          (currentChat === chat.conversationID
            ? 'bg-[#424549] text-white'
            : 'text-[#ADADAD]')
        }>
        {chat.participants[0].userID === userID
          ? chat.participants[1].firstName + ' ' + chat.participants[1].lastName
          : chat.participants[0].firstName +
            ' ' +
            chat.participants[0].lastName}
      </div>
    ));

    return <div className="px-2 py-1">{result}</div>;
  }
  if (view === 'Friends') {
    const result = friends.map((p: Person) => (
      <div
        key={p.userID}
        className="mx-auto basis-[100%] my-2 p-2 w-full font-medium text-[20px] text-[#ADADAD] rounded-md hover:bg-[#424549] hover:text-white cursor-pointer  ">
        {p.firstName} {p.lastName}
      </div>
    ));
    return <div className="px-2 py-1">{result}</div>;
  }

  if (view === 'Requests') {
    const result = friendRequests.map((request: FriendRequest) => (
      <div className="flex justify-between mx-auto basis-[100%] my-2 p-2 w-full font-medium text-[20px] text-white rounded-md">
        <div key={request.senderID}>
          {request.firstName} {request.lastName}
        </div>
        <div className="flex">
          <FaCheck
            className="text-right cursor-pointer ml-4 text-2xl self-center"
            style={{ color: '#FFFFFF' }}
            onClick={() =>
              socket?.emit('friend-request-decision', {
                decision: 'accept',
                senderID: request.senderID,
                receiverID: userID,
              })
            }></FaCheck>
          <FaXmark
            className="text-right cursor-pointer ml-4 text-2xl self-center"
            style={{ color: '#FFFFFF' }}
            onClick={() =>
              socket?.emit('friend-request-decision', {
                decision: 'reject',
                senderID: request.senderID,
                receiverID: userID,
              })
            }></FaXmark>
        </div>
      </div>
    ));
    return <div className="px-2 py-1">{result}</div>;
  }
}
