import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { MoveLeft, Paperclip, Send } from "lucide-react";
import Picker from "emoji-picker-react";
import { useState } from "react";

export function ChatWindow({ conversation, messages, onBack, onSendMessage }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmojiSelect = (emojiData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-start space-x-6 px-4 py-2 border-b">
        <div className="lg:hidden">
          <MoveLeft className="cursor-pointer" onClick={onBack} />
        </div>
        <div className="flex items-center space-x-1">
          <Avatar className="w-10 h-10">
            <AvatarFallback>{conversation.group?.name.charAt(0) || conversation.receiver?.username.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <h1 className="text-lg font-semibold">{conversation.group?.name || conversation.receiver?.username || "Unknown"}</h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-scroll h-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end space-x-2 ${msg.sender.id === conversation.receiver?.id ? 'justify-end' : 'justify-start'}`}>
            <Avatar>
              <AvatarImage src={"test"} alt="User Avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className={`p-2 rounded-lg ${msg.sender.id === conversation.receiver?.id ? 'bg-gray-100' +
                ' dark:bg-gray-800' : 'bg-primary text-foreground'}`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
      </main>
      <footer className="flex items-center space-x-2 p-2 border-b border-t">
        <div className="flex items-center space-x-2 flex-1">
          <Paperclip className="w-6 h-6 text-muted-foreground cursor-pointer" />
          <Textarea
            className="flex-1 resize-none h-10 p-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="cursor-pointer">
            😊
          </button>
        </div>
        <Send className="w-6 h-6 cursor-pointer" onClick={handleSendMessage} />
      </footer>

      {showEmojiPicker && (
        <div className="absolute bottom-20 right-6">
          <Picker onEmojiClick={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
}
