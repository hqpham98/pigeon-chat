import { MainPanel } from '../components/MainPanel';
import { SidePanel } from '../components/SidePanel';
import { useState } from 'react';

export function Home() {
  const [sideView, setSideView] = useState<'Chats' | 'Friends' | 'Requests'>(
    'Chats'
  );
  return (
    <div className="flex">
      <div className="bg-[#282B30] min-w-96  w-screen  md:w-96  min-h-screen">
        <SidePanel view={sideView} />
      </div>
      <div className="bg-[#34373C] md:w-full ">
        <MainPanel />
      </div>
    </div>
  );
}
