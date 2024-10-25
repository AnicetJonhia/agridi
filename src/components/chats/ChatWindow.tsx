import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea"; // Importer Textarea
import { MoveLeft, Paperclip, Send } from "lucide-react";
import Picker from "emoji-picker-react";
import { useState } from "react";

// @ts-expect-error
export function ChatWindow({ sender, onBack }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmojiSelect = (emojiData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Message envoyé :", message);
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
        <div className={"lg:hidden"}>
          <MoveLeft className="cursor-pointer" onClick={onBack} />
        </div>
        <div className={"flex items-center space-x-1"}>
          <Avatar className="w-10 h-10">
            <AvatarImage src={sender.avatar} alt={sender.name} />
            <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h1 className="text-lg font-semibold">{sender.name}</h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-scroll h-auto p-4 space-y-4">
        <div className="flex items-end space-x-2">
          <Avatar>
            <AvatarImage src={sender.avatar} alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p className="text-sm">{sender.lastMessage}</p>
          </div>
        </div>
      </main>
      <footer className="flex items-center space-x-2 p-2 border-b border-t">
        <div className="flex items-center space-x-2 flex-1">
          <Paperclip className="w-6 h-6 text-muted-foreground cursor-pointer" />
          <Textarea
            className="flex-1 resize-none h-10 p-2    focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown} // Gérer l'appui sur la touche Entrée
          />
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="cursor-pointer"
          >
            😊
          </button>
        </div>
        <Send className="w-6 h-6 cursor-pointer" onClick={handleSendMessage} />
      </footer>

      {showEmojiPicker && (
        <div className="absolute bottom-10 z-10">
          <Picker onEmojiClick={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
}
