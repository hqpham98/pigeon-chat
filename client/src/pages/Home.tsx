import { MainPanel } from '../components/MainPanel';
import { SidePanel } from '../components/SidePanel';
import { useState, useEffect } from 'react';
import { View } from '../lib/types';

export function Home() {
  const [sideView, setSideView] = useState<View>('Chats');
  const [currentConvo, setCurrentConvo] = useState('');
  const [convosLoaded, setConvosLoaded] = useState(false);

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
  });

  return (
    <div className="flex">
      <div className="bg-[#282B30] min-w-96  w-screen  sm:w-96  min-h-screen">
        <SidePanel view={sideView} changeView={(v: View) => setSideView(v)} />
      </div>
      <div className="bg-[#34373C] sm:w-full ">
        <MainPanel conversationID={currentConvo} />
      </div>
    </div>
  );
}
