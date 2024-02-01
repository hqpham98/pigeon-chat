import {
  FaUserGroup,
  FaPenToSquare,
  FaRegMessage,
  FaRegBell,
  FaUserPlus,
} from 'react-icons/fa6';
import { View } from '../lib/types';
import { UserEntry } from './UserEntry';

type SideProps = {
  view: View;
  changeView: (v: View) => void;
};

export function SidePanel({ view, changeView }: SideProps) {
  function loadHeaderButtons() {
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
  return (
    //Header
    <div className="h-14 py-2 px-4 border-solid border-[#2E3034] border-b-2 flex">
      <h1 className="text-white font-bold text-2xl basis-[50%] self-center">
        {view}
      </h1>
      {/* Header Button Container */}
      <div className="flex basis-[50%] justify-end">{loadHeaderButtons()}</div>
    </div>
  );
}
