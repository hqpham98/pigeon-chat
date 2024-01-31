import { FaUserGroup, FaPenToSquare } from 'react-icons/fa6';

type ViewProp = {
  view: 'Chats' | 'Friends' | 'Requests';
};

export function SidePanel({ view }: ViewProp) {
  return (
    //Header
    <div className="h-14 py-2 px-4 border-solid border-[#2E3034] border-b-2 flex">
      <h1 className="text-white font-bold text-2xl basis-[50%] self-center">
        {view}
      </h1>
      {/* Header Button Container */}
      <div className="flex basis-[50%] justify-end">
        <FaUserGroup
          className="text-right cursor-pointer ml-2 text-2xl self-center"
          style={{ color: '#FFFFFF' }}
        />
        <FaPenToSquare
          className=" cursor-pointer ml-2 text-2xl self-center"
          style={{ color: '#FFFFFF' }}
        />
      </div>
    </div>
  );
}
