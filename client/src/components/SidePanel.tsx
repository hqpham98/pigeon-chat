import {
  FaUserGroup,
  FaPenToSquare,
  FaRegMessage,
  FaRegBell,
  FaUserPlus,
} from 'react-icons/fa6';
import { View, Conversation } from '../lib/types';
import { HomeContext, HomeContextValues } from './HomeContext';
import { useContext } from 'react';
import { PanelEntry } from './PanelEntry';

type SideProps = {
  view: View;
  changeView: (v: View) => void;
};

export function SidePanel({ view, changeView }: SideProps) {
  return (
    // Container

    <div>
      {/* Header */}
      <div className="h-14 py-2 px-4 border-solid border-[#2E3034] border-b-2 flex">
        <h1 className="text-white font-bold text-2xl basis-[50%] self-center">
          {view}
        </h1>
        {/* Header Button Container */}
        <div className="flex basis-[50%] justify-end">
          <HeaderButtons view={view} changeView={changeView} />
        </div>
      </div>
      {/* Panel Body */}
      <div className="py-2 px-4">
        <PanelBody view={view} changeView={changeView} />
      </div>
    </div>
  );
}

function HeaderButtons({ view, changeView }: SideProps) {
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

function PanelBody({ view, changeView }: SideProps) {
  const homeContext: HomeContextValues = useContext(HomeContext);
  const {
    currentChat,
    chats,
    friends,
    currentChatLoaded,
    chatsLoaded,
    friendsLoaded,
    messageEvent,
  } = homeContext;
  if (view === 'Chats') {
    const result = chats.map((chat: Conversation) => (
      <div
        key={chat.conversationID}
        className="mx-auto basis-[100%] my-2 py-2 w-full font-medium text-[20px] rounded-md text-[#ADADAD] hover:bg-[#424549] hover:text-white cursor-pointer">
        <span>{chat.conversationID}</span>
      </div>
    ));

    return <div className="px-2 py-1">{result}</div>;
  }
}
