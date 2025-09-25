import React, { useEffect, useRef } from "react";

interface Message {
  user: string;
  text: string;
}

interface ChatProps {
  messages: Message[];
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

const Chat: React.FC<ChatProps> = ({ messages, newMessage, onMessageChange, onSendMessage }) => {
  const username = sessionStorage.getItem("username");
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Window */}
      <div
        ref={chatWindowRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 rounded-lg mb-3"
        style={{ maxHeight: '200px' }}
      >
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center py-4">No messages yet</div>
        ) : (
          messages.map((msg, index) => {
            const isCurrentUser = msg.user === username;
            return (
              <div
                key={index}
                className={`max-w-[80%] rounded-lg p-2 ${
                  isCurrentUser
                    ? 'bg-[#8F64E1] text-white ml-auto'
                    : 'bg-[#3A3A3B] text-white mr-auto'
                }`}
              >
                <div className="text-xs font-medium mb-1">
                  {isCurrentUser ? 'You' : msg.user}:
                </div>
                <div className="text-sm break-words whitespace-pre-wrap">
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A66D1]"
        />
        <button
          onClick={onSendMessage}
          className="bg-[#5A66D1] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#4a56c1] transition-colors border-none"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;