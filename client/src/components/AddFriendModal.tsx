import { HomeContext, HomeContextValues } from './HomeContext';
import { AppContext, AppContextValues } from './AppContext';
import { useContext, useEffect, useState } from 'react';
import { Person } from '../lib/types';

type FriendModalProps = {
  viewModal: (x: boolean) => void;
};

export function AddFriendModal({ viewModal }: FriendModalProps) {
  const homeContext: HomeContextValues = useContext(HomeContext);
  const appContext: AppContextValues = useContext(AppContext);

  const [friendName, setFriendName] = useState(''); // The inputted username
  const [enterPressed, setEnterPressed] = useState(false); // Toggling enterPressed state triggers a db lookup for inputted username
  const [loading, setLoading] = useState(false); // Controls display of search results upon pressing Enter button
  const [modalMessage, setModalMessage] = useState(''); // Modal will display Error message upon unsuccessful db lookup

  const { socket } = homeContext;
  /**
   * Check database for inputted username everytime Enter is pressed
   *
   * TODO:  If already friends, display error message
   * TODO:  If request already exists, display error message
   */
  useEffect(() => {
    async function sendRequest(username: string) {
      try {
        const res = await fetch(`/api/pigeon/users/${username}`);
        const user: Person[] = await res.json();

        if (loading) {
          setLoading(false);

          // User does not exist
          if (!user.length) {
            setModalMessage(`User doesn't exist.`);
          } else {
            // User does exist

            // Send friend request to Socket server
            const payload = {
              senderID: appContext.user?.userID,
              receiverID: user[0].userID,
            };
            socket?.emit('friend-request-sent', payload);
            viewModal(false);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    sendRequest(friendName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterPressed]);

  return (
    // Invisible Background
    <div
      className="absolute top-0 bottom-0 left-0 right-0 flex justify-center"
      onClick={() => viewModal(false)}>
      {/* Modal */}
      <div
        id="add-friend-modal"
        className="absolute flex justify-center self-center m-auto w-72 py-4 bg-[#1F2124] rounded px-4"
        onClick={(event) => event.stopPropagation()}>
        <div className="self-center w-full">
          <h1 className="font-medium text-white text-lg pb-2">
            Add New Friend
          </h1>
          <input
            className="block bg-[#424549] placeholder:text-[#ADADAD] text-white p-2 w-full rounded focus:outline-none"
            type="text"
            placeholder="Type in a friend's ID"
            onChange={(e) => setFriendName(e.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                if (!loading) {
                  setModalMessage('');
                  setLoading(true);
                  setEnterPressed((prev) => !prev);
                }
              }
            }}></input>
          {loading && <h1 className="text-white">Loading</h1>}
          {modalMessage && <h1 className="text-red-500">{modalMessage}</h1>}
        </div>
      </div>
    </div>
  );
}
