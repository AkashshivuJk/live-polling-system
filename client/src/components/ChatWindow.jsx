import React, { useEffect, useState } from "react";

const ChatWindow = ({ socket, userName, isTeacher, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!socket) return;
    socket.emit("registerName", userName, isTeacher);

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, [socket, userName, isTeacher]);

  const sendMessage = () => {
    if (text.trim()) {
      socket.emit("chatMessage", text);
      setText("");
    }
  };

  return (
    <div className="fixed bottom-16 right-4 bg-white border rounded-lg shadow-xl w-80 max-h-96 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-purple-600 text-white p-2 rounded-t-lg">
        <span className="font-semibold">Chat</span>
        <button onClick={onClose}>✖</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center text-sm">No messages yet</p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.sender === userName
                ? "bg-purple-100 self-end ml-auto"
                : "bg-gray-100"
            }`}
          >
            <p className="text-xs text-gray-500">{msg.sender}</p>
            <p>{msg.message}</p>
            <p className="text-[10px] text-gray-400 text-right">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-2 border-t flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded p-1 text-sm"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
