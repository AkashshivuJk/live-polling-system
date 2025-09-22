import React, { useState } from "react";
import ChatWindow from "./ChatWindow";

const ChatButton = ({ socket, userName, isTeacher }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700"
      >
        💬
      </button>

      {open && (
        <ChatWindow
          socket={socket}
          userName={userName}
          isTeacher={isTeacher}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ChatButton;
