import {
  FaUserGroup,
  FaPenToSquare,
  FaRegMessage,
  FaRegBell,
  FaUserPlus,
  FaCheck,
  FaXmark,
} from 'react-icons/fa6';
import { View, Conversation, Friend, FriendRequest } from '../lib/types';
import { HomeContext, HomeContextValues } from './HomeContext';
import { AddFriendModal } from './AddFriendModal';
import { useContext, useState } from 'react';

type SideProps = {
  view: View;
  changeView: (v: View) => void;
};

export function SidePanel({ view, changeView }: SideProps) {
  const [viewFriendModal, setViewFriendModal] = useState(false);

  return (
    // Container
    <div>
      {viewFriendModal && <AddFriendModal viewModal={setViewFriendModal} />}
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
            modalView={setViewFriendModal}
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
  modalView: (x: boolean) => void;
};

function HeaderButtons({ view, changeView, modalView }: HeaderProps) {
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
          onClick={() => modalView(true)}
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
  const homeContext: HomeContextValues = useContext(HomeContext);
  const { currentChat, chats, friends, friendRequests, setCurrentChat } =
    homeContext;

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
        {chat.conversationID}
      </div>
    ));

    return <div className="px-2 py-1">{result}</div>;
  }
  if (view === 'Friends') {
    const result = friends.map((f: Friend) => (
      <div
        key={f.userID}
        className="mx-auto basis-[100%] my-2 p-2 w-full font-medium text-[20px] text-[#ADADAD] rounded-md hover:bg-[#424549] hover:text-white cursor-pointer  ">
        {f.firstName} {f.lastName}
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
            style={{ color: '#FFFFFF' }}></FaCheck>
          <FaXmark
            className="text-right cursor-pointer ml-4 text-2xl self-center"
            style={{ color: '#FFFFFF' }}></FaXmark>
        </div>
      </div>
    ));
    return <div className="px-2 py-1">{result}</div>;
  }
}
