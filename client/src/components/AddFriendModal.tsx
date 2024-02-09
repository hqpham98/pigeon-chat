type FriendModalProps = {
  viewModal: (x: boolean) => void;
};

export function AddFriendModal({ viewModal }: FriendModalProps) {
  return (
    // Background
    <div
      className="absolute top-0 bottom-0 left-0 right-0"
      onClick={() => viewModal(false)}>
      {/* Modal */}
      <div
        className="absolute flex justify-center left-0 right-0 top-0 bottom-0 m-auto h-28 w-72 bg-[#1F2124] rounded px-4"
        onClick={(event) => event.stopPropagation()}>
        <div className="self-center w-full">
          <h1 className="font-medium text-white text-lg pb-2">
            Add New Friend
          </h1>
          <input
            className="block bg-[#424549] placeholder:text-[#ADADAD] text-white p-2 w-full rounded focus:outline-none"
            type="text"
            placeholder="Type in a friend's ID"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                viewModal(false);
              }
            }}></input>
        </div>
      </div>
    </div>
  );
}
