import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { MoveLeft, Paperclip, Send } from "lucide-react";
import Picker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import ImagePreview from "@/components/utils/ImagePreview.tsx";
import { Input } from "@/components/ui/input";
import VideoPreview from "@/components/utils/VideoPreview.tsx";
import { Label } from "@/components/ui/label.tsx";

interface Message {
  id: number;
  sender: { id: number; username: string; profile_picture: string };
  receiver: { id: number; username: string; profile_picture: string } | null;
  content: string | null;
  timestamp: string;
  file?: string;
}

interface Conversation {
  id: number;
  group?: { id: number; name: string; photo: string };
  sender: { id: number; username: string; profile_picture: string };
  receiver: { id: number; username: string; profile_picture: string };
}

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (message: string, file: File | null) => void;
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-En", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(date));
};

export function ChatWindow({ conversation, messages, onBack, onSendMessage }: ChatWindowProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const currentUserId = Number(localStorage.getItem("userId"));
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleEmojiSelect = (emojiData: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSendMessage = () => {
    if (message.trim() || file) {
      onSendMessage(message, file);
      setMessage("");
      setFile(null);
      setFilePreview(null);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const formatMessageContent = (content: string, maxCharsPerLine = 45) => {
    const splitLongSequences = (text: string, maxChars: number) => {
      return text.split(" ").map(word => {
        if (word.length > maxChars) {
          const chars = word.split("");
          let newWord = "";
          let charCount = 0;

          chars.forEach(char => {
            newWord += char;
            charCount++;

            if (charCount === maxChars) {
              newWord += "\n";
              charCount = 0;
            }
          });

          return newWord.trim();
        }

        return word;
      }).join(" ");
    };

    const adjustedContent = splitLongSequences(content, maxCharsPerLine);
    const lines: string[] = [];
    let currentLine = "";

    adjustedContent.split(" ").forEach(word => {
      if ((currentLine + word).length > maxCharsPerLine) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine += word + " ";
      }
    });

    if (currentLine) {
      lines.push(currentLine.trim());
    }

    return lines.join("\n");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const displayName =
    conversation.group?.name ||
    (currentUserId === conversation.receiver?.id
      ? conversation.sender?.username
      : conversation.receiver?.username);

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
                src={typeof displayPhoto === "string" ? displayPhoto : URL.createObjectURL(displayPhoto)}
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
                      src={typeof msg.sender.profile_picture === "string" ? msg.sender.profile_picture : URL.createObjectURL(msg.sender.profile_picture)}
                      alt="S"
                    />
                  ) : (
                    <AvatarFallback>{msg.sender.username.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
              )}
              <div className="space-y-0.5 ">
                <div className={"flex space-x-2"}>
                  {!isCurrentUserSender && msg.sender && conversation?.group && (
                    <p className="text-xs text-muted-foreground">{msg.sender.username}</p>
                  )}
                  <span className={"text-xs text-muted-foreground"}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {msg.content && (
                  <div
                    className={`p-2 rounded-lg ${
                      isCurrentUserSender
                        ? "bg-[#149911] text-white rounded-br-none"
                        : "bg-muted  rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{formatMessageContent(msg.content)}</p>
                  </div>
                )}

                {msg?.file && (
                  (() => {
                    const fileURL = msg.file;
                    const fileExtension = fileURL?.split('.').pop()?.toLowerCase();

                    if (fileExtension && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'jfif'].includes(fileExtension)) {
                      return <ImagePreview fileURL={fileURL} />;
                    } else if (fileExtension && ['mp4', 'webm', 'ogg'].includes(fileExtension)) {
                      return <VideoPreview fileURL={fileURL} />;
                    } else if (fileExtension && ['mp3', 'wav'].includes(fileExtension)) {
                      return (
                        <audio
                          src={fileURL}
                          controls
                          className="w-20 h-20"
                        />
                      );
                    } else {
                      return (
                        <div className="mt-2">
                          <a
                            href={fileURL}
                            download
                            className="text-sm border-2 border-t-0 border-dashed border-bg-muted font-semibold text-foreground hover:text-muted-foreground no-underline bg-transparent px-2 py-1 rounded-lg shadow-sm hover:shadow-md transition duration-200 ease-in-out"
                          >
                            {fileURL?.split('/').pop()}
                          </a>
                        </div>
                      );
                    }
                  })()
                )}
              </div>
            </div>
          );

          return acc;
        }, [])}
        <div ref={messagesEndRef} />
      </main>
      <footer className="flex items-center space-x-2 p-2 border-b border-t">
        <div className="flex relative items-center space-x-2 flex-1">
          <Label
            htmlFor="file"
            className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground space-x-2"
          >
            <Paperclip className="w-6 h-6 text-muted-foreground cursor-pointer" />
          </Label>
          <Input id={"file"} onChange={handleFileChange} className={"w-48"} type={"file"} style={{ display: 'none' }} />
          <Textarea
            className="flex-1 resize-none h-10 p-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="cursor-pointer absolute right-2">
            😊
          </button>
        </div>


        <button
            onClick={handleSendMessage}
            disabled={!message.trim() && !filePreview}
            className={`w-6 h-6 cursor-pointer transition-colors  ${!message.trim() && !filePreview ? 'hidden' : 'text-[#149911] hover:text-primary'}`}
          >
            <Send />
          </button>
      </footer>

      {showEmojiPicker && (
        <div className="absolute bottom-20 right-6">
          <Picker onEmojiClick={handleEmojiSelect} />
        </div>
      )}

      {filePreview && (
        <div className="absolute bg-muted bottom-20 p-2 rounded-lg ">
          <div className="relative inset-0 bg-gray-500 opacity-50 z-10" />
          {file && (
            (() => {
              const fileExtension = file.name.split('.').pop()?.toLowerCase();

              if (fileExtension && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'jfif'].includes(fileExtension)) {
                return (
                  <div className={"flex relative justify-between text-center"}>
                    <img src={filePreview} alt="uploaded" className="w-20 h-auto rounded-lg "/>
                    <button onClick={handleRemoveFile} className="text-red-500 ml-2">
                      ❌
                    </button>
                  </div>
                );
              } else if (fileExtension && ['mp4', 'webm', 'ogg'].includes(fileExtension)) {
                return (
                  <div className={"flex relative justify-between text-center"}>
                    <video
                      src={filePreview}
                      className="w-28 h-28 cursor-pointer rounded"
                      onClick={(e) => e.stopPropagation()}
                      muted
                    />
                    <button onClick={handleRemoveFile} className="text-red-500 ml-2">
                      ❌
                    </button>
                  </div>
                );
              } else if (fileExtension && ['mp3', 'wav'].includes(fileExtension)) {
                return (
                  <div className={"flex relative justify-between text-center"}>
                    <audio
                      src={filePreview}
                      controls
                      className="w-full max-w-xs h-auto z-20 relative"
                    />
                    <button onClick={handleRemoveFile} className="text-red-500 ml-2">
                      ❌
                    </button>
                  </div>
                );
              } else {
                return (
                  <div className="mt-2 z-20 flex justify-between text-center">
                    <span className="text-sm">{file.name}</span>
                    <button onClick={handleRemoveFile} className="text-red-500 ml-2">
                      ❌
                    </button>
                  </div>
                );
              }
            })()
          )}
        </div>
      )}
    </div>
  );
}