import React from "react";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Replace with your server address

function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    // Socket.IO event listeners

    // Listen for incoming messages
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // Cleanup on component unmount
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      const message = { text: messageInput, timestamp: new Date() };
      socket.emit("message", message);
      setMessageInput("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('path/to/your/background-image.jpg')" }}>
      <div className="bg-white bg-opacity-80 rounded-lg w-full max-w-md h-full max-h-screen p-4 shadow-md flex flex-col">
        <div className="flex-1 p-2 overflow-y-auto bg-gray-100 rounded-md mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.senderId === socket.id ? "items-end" : "items-start"
              } mb-2`}
            >
              <div
                className={`${
                  msg.senderId === socket.id ? "bg-blue-500" : "bg-gray-300"
                } text-white p-2 rounded-md max-w-xs break-words`}
              >
                {msg.text}
              </div>
              <span className="text-gray-500 text-xs">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-gray-300">
          <div className="flex">
            <input
              type="text"
              className="w-full px-2 py-1 border rounded-l-md outline-none"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress} // Added event listener for key press
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;