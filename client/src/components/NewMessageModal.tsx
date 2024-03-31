import { HomeContext, HomeContextValues } from './HomeContext';
import { AppContext, AppContextValues } from './AppContext';
import { useContext, useEffect, useState } from 'react';
import { Person } from '../lib/types';

type MessageModalProps = {
  viewModal: (x: boolean) => void;
};

export function NewMessageModal({ viewModal }: MessageModalProps) {
  const homeContext: HomeContextValues = useContext(HomeContext);
  const { friends } = homeContext;

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Person[]>([]);

  useEffect(() => {
    setResults(
      friends.filter(
        (p: Person) =>
          `${p.firstName} ${p.lastName}`
            .toLowerCase()
            .startsWith(searchQuery.toLowerCase()) ||
          `${p.username}`.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  return (
    // Background
    <div
      className="absolute top-0 bottom-0 left-0 right-0 flex justify-center"
      onClick={() => viewModal(false)}>
      {/* Modal */}
      <div
        className="absolute flex justify-center self-center m-auto w-72 py-4 bg-[#1F2124] rounded px-4"
        onClick={(event) => event.stopPropagation()}>
        <div className="self-center w-full">
          <h1 className="font-medium text-white text-lg pb-2">
            New Direct Message
          </h1>
          <input
            className="block bg-[#424549] placeholder:text-[#ADADAD] text-white p-2 w-full rounded focus:outline-none"
            type="text"
            placeholder="Type in a friend's name or ID"
            onChange={(e) => {
              setSearchQuery(e.currentTarget.value);
            }}></input>
          {searchQuery && (
            <SearchResults results={results} viewModal={viewModal} />
          )}
        </div>
      </div>
    </div>
  );
}

type ResultsProps = {
  results: Person[];
  viewModal: (x: boolean) => void;
};
function SearchResults({ results, viewModal }: ResultsProps) {
  const homeContext: HomeContextValues = useContext(HomeContext);
  const appContext: AppContextValues = useContext(AppContext);
  const { socket } = homeContext;
  const { user } = appContext;

  if (results.length === 0) {
    return <h1 className="text-red-500">No results found</h1>;
  }

  const result = results.map((p: Person) => (
    <div
      className="flex justify-between pt-2 text-[#ADADAD] hover:text-white cursor-pointer"
      onClick={() => {
        socket?.emit('private-message-request', {
          userID1: user?.userID,
          userID2: p.userID,
        });
        viewModal(false);
      }}
      key={p.userID}>
      <div>
        {p.firstName} {p.lastName}
      </div>
      <div>{`@${p.username}`}</div>
    </div>
  ));
  return <>{result}</>;
}
