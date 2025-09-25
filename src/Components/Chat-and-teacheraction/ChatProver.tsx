import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import chatIcon from "../../assets/chat.svg";

interface Message {
  user: string;
  text: string;
}

interface JoinChatData {
  username: string | null;
}

const apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

const socket = io(apiUrl);

const ChatPopover: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
    
    const username = sessionStorage.getItem("username");
    const joinData: JoinChatData = { username };
    socket.emit("joinChat", joinData);

    const handleChatMessage = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleParticipantsUpdate = (participantsList: string[]) => {
      setParticipants(participantsList);
    };

    socket.on("chatMessage", handleChatMessage);
    socket.on("participantsUpdate", handleParticipantsUpdate);

    return () => {
      socket.off("chatMessage", handleChatMessage);
      socket.off("participantsUpdate", handleParticipantsUpdate);
    };
  }, []);

  const username = sessionStorage.getItem("username");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = { user: username || "Unknown", text: newMessage };
      socket.emit("chatMessage", message);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleKickOut = (participant: string) => {
    socket.emit("kickOut", participant);
  };

  // const ParticipantsTab: React.FC = () => (
  //   <div className="max-h-72 overflow-y-auto">
  //     {participants.length === 0 ? (
  //       <div className="text-gray-500 text-center py-4">No participants connected</div>
  //     ) : (
  //       <div className="overflow-x-auto">
  //         <table className="w-full text-sm">
  //           <thead className="bg-gray-100">
  //             <tr>
  //               <th className="px-4 py-2 text-left font-medium">Name</th>
  //               {username?.startsWith("teacher") && <th className="px-4 py-2 text-left font-medium">Actions</th>}
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {participants.map((participant, index) => (
  //               <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
  //                 <td className="px-4 py-2">{participant}</td>
  //                 {username?.startsWith("teacher") && (
  //                   <td className="px-4 py-2">
  //                     <button
  //                       onClick={() => handleKickOut(participant)}
  //                       className="text-red-600 hover:text-red-800 text-xs font-medium transition-colors"
  //                     >
  //                       Kick Out
  //                     </button>
  //                   </td>
  //                 )}
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     )}
  //   </div>
  // );

  const ChatTab: React.FC = () => (
    <div className="flex flex-col h-72">
      <div 
        ref={chatWindowRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 rounded-lg"
      >
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No messages yet</div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="bg-white p-2 rounded-lg shadow-sm">
              <div className="font-medium text-blue-600">{message.user}:</div>
              <div className="text-gray-800">{message.text}</div>
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Popover */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="p-4">
            <div className="flex border-b border-gray-200 mb-3">
              <button
                onClick={() => {}}
                className="flex-1 py-2 text-center font-medium text-blue-600 border-b-2 border-blue-600"
              >
                Chat
              </button>
              <button
                onClick={() => {}}
                className="flex-1 py-2 text-center font-medium text-gray-500 hover:text-gray-700"
              >
                Participants ({participants.length})
              </button>
            </div>
            
            <div className="h-80">
              <ChatTab />
            </div>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-full p-3 shadow-lg"
      >
        <img
          className="w-8 h-8"
          src={chatIcon}
          alt="chat icon"
        />
      </button>
    </div>
  );
};

export default ChatPopover;