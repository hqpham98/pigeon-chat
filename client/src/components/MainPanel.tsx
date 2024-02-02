import { useEffect, useContext } from 'react';
import { HomeContext, HomeContextValues } from './HomeContext';

export function MainPanel() {
  const homeContext: HomeContextValues = useContext(HomeContext);

  return (
    //Container
    <div>
      {/* Header */}
      <div className="flex h-14 py-2 px-4 border-solid border-[#2E3034] border-b-2 ">
        <h1 className="text-white font-bold text-2xl basis-[50%] self-center">
          {homeContext.currentChat}
        </h1>
      </div>
      {/* Panel Body */}
      <div className="min-h-96 h-[calc(100vh-3.5rem)] flex flex-col">
        <MessageArea />
        <InputArea />
      </div>
    </div>
  );
}

function MessageArea() {
  const homeContext: HomeContextValues = useContext(HomeContext);
  return <div className="h-full"></div>;
}
function InputArea() {
  const homeContext: HomeContextValues = useContext(HomeContext);
  return (
    <div className="min-h-[4.5rem] flex p-4">
      <input
        type="text"
        placeholder={`Message ${homeContext.currentChat}`}
        className="bg-[#424549] placeholder:text-[#ADADAD] text-white p-2 h-full m-auto w-full rounded focus:outline-none"></input>
    </div>
  );
}
