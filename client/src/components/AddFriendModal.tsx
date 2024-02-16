import { Socket } from 'socket.io-client';
import { HomeContext, HomeContextValues } from './HomeContext';
import { AppContext, AppContextValues } from './AppContext';
import { useContext, useEffect, useState } from 'react';
import { Person, FriendRequest } from '../lib/types';

type FriendModalProps = {
  viewModal: (x: boolean) => void;
};

export function AddFriendModal({ viewModal }: FriendModalProps) {
  const homeContext: HomeContextValues = useContext(HomeContext);
  const appContext: AppContextValues = useContext(AppContext);

  const [friendName, setFriendName] = useState('');
  const [enterPressed, setEnterPressed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const { socket } = homeContext;
  /**
   * Check database for inputted username
   */
  useEffect(() => {
    async function sendRequest(username: string) {
      try {
        const res = await fetch(`/api/pigeon/users/${username}`);
        const user: Person[] = await res.json();
        console.log('user', user);
        if (loading) {
          setLoading(false);
          // User does not exist
          if (!user.length) {
            setModalMessage(`User doesn't exist.`);
          } else {
            // User does exist
            //TODO:  If already friends, display error message
            //TODO:  If request already exists, display error message

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
  }, [enterPressed]);

  return (
    // Background
    <div
      className="absolute top-0 bottom-0 left-0 right-0"
      onClick={() => viewModal(false)}>
      {/* Modal */}
      <div
        className="absolute flex justify-center left-0 right-0 top-0 bottom-0 m-auto h-28 max-h-32 w-72 bg-[#1F2124] rounded px-4"
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
                //if Request succeeds, hide modal
                //Else, display error code
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
