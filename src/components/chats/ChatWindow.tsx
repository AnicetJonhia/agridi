import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { MoveLeft, Paperclip, Send } from "lucide-react";
import Picker from "emoji-picker-react";
import { useState } from "react";


// Fonction pour formater la date en "Mercredi 30 Octobre"
const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-En", {
        weekday: "long",
        day: "numeric",
        month: "long",
    }).format(new Date(date));
};

export function ChatWindow({ conversation, messages, onBack, onSendMessage }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const currentUserId = Number(localStorage.getItem("userId"));

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

  const displayName =
    currentUserId === conversation.receiver?.id
      ? conversation.sender?.username
      : conversation.receiver?.username || conversation.group?.name;

  const displayPhoto =
    conversation.group?.photo ||
    (currentUserId === conversation.receiver?.id
        ? conversation.sender?.profile_picture
        : conversation.receiver?.profile_picture);

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-start space-x-6 px-4 py-2 border-b">
        <div className="lg:hidden">
          <MoveLeft className="cursor-pointer" onClick={onBack} />
        </div>
        <div className="flex items-center space-x-1">
          <Avatar className="w-10 h-10">
              {displayPhoto ? (
                  <img
                      src={
                          displayPhoto instanceof File
                              ? URL.createObjectURL(displayPhoto)
                              : displayPhoto
                      }
                      alt="A"
                  />
              ) : (
                 <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
              )}
          </Avatar>
          <h1 className="text-lg font-semibold">{displayName || "Unknown"}</h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-scroll h-auto p-4 space-y-4">
        {messages.reduce((acc, msg, index) => {
          const msgDate = formatDate(msg.timestamp);
          const prevDate = index > 0 ? formatDate(messages[index - 1].timestamp) : null;
          const isNewDay = msgDate !== prevDate;

          if (isNewDay) {
            acc.push(
              <div key={`date-${msg.id}`} className="text-center text-sm text-muted-foreground my-4">
                {msgDate}
              </div>
            );
          }

          const isCurrentUserSender = msg.sender.id === currentUserId;
          acc.push(
            <div
              key={msg.id}
              className={`flex items-end space-x-2 ${isCurrentUserSender ? 'justify-end' : 'justify-start'}`}
            >
              {!isCurrentUserSender && (
                <Avatar className={"w-6 h-6"}>
                  {msg.sender?.profile_picture ? (
                    <AvatarImage
                      src={
                        msg.sender.profile_picture instanceof File
                          ? URL.createObjectURL(msg.sender.profile_picture)
                          : msg.sender.profile_picture
                      }
                      alt="S"
                    />
                  ) : (
                    <AvatarFallback>{msg.sender.username.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
              )}
              <div className="space-y-0.5">
                <div className={"flex space-x-2"}>
                  {!isCurrentUserSender && msg.sender && conversation?.group && (
                    <p className="text-xs text-muted-foreground">{msg.sender.username}</p>
                  )}
                  <span className={"text-xs text-muted-foreground"}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div
                  className={`p-2 rounded-lg ${
                    isCurrentUserSender
                      ? "bg-primary text-foreground rounded-br-none"
                      : "bg-gray-100 dark:bg-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            </div>
          );

          return acc;
        }, [])}
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
