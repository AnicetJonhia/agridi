import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { BadgeInfo, MoveLeft, Paperclip, Send, SmilePlus } from "lucide-react";
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
  files?: { id: number; file: string }[];
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
  onSendMessage: (message: string, files: File[]) => void;
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

  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">("bottom");
  const msgContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (msgContentRef.current) {
      const rect = msgContentRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.bottom > viewportHeight - 100) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [showDropdown]);

  const handleEmojiSelect = (emojiData: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  const handleSendMessage = () => {
    if (message.trim() || files.length > 0) {
      onSendMessage(message, files);
      setMessage("");
      setFiles([]);
      setFilePreviews([]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 5 * 24)}px`;
    }
  }, [message]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
      setFilePreviews((prevPreviews) => [
        ...prevPreviews,
        ...selectedFiles.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFilePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
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
          <button onClick={onBack} className="p-2 ">
            <MoveLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-1 items-center space-x-1">
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
        <div>
          <button className="p-2 ">
            <BadgeInfo className="w-6 h-6" />
          </button>
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
              <div className="space-y-0.5">
                <div className={"flex space-x-2"}>
                  {!isCurrentUserSender && msg.sender && conversation?.group && (
                    <p className="text-xs text-muted-foreground">{msg.sender.username}</p>
                  )}
                  <span className={"text-xs text-muted-foreground"}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {msg.content && (
                  <div className="flex relative" ref={msgContentRef}>
                    {!isCurrentUserSender && (
                      <div className="flex items-end space-x-0">
                        <span className="w-2 h-2 bg-muted rounded-full"></span>
                        <span className="w-3 h-3 bg-muted rounded-full"></span>
                      </div>
                    )}
                    <div
                      className={`p-2 rounded-lg -ml-0.5 -mr-0.5 ${
                        isCurrentUserSender
                          ? "bg-gradient-to-br from-primary to-[#149911] text-white"
                          : "bg-gradient-to-r from-muted to-transparent"
                      } max-w-full break-words`}
                    >
                      <p
                        className="cursor-pointer text-sm whitespace-pre-wrap"
                        onClick={() => setShowDropdown(showDropdown === msg.id ? null : msg.id)}
                      >
                        {formatMessageContent(msg.content)}
                      </p>
                    </div>
                    {isCurrentUserSender && (
                      <div className="flex items-end space-x-0">
                        <span className="w-3 h-3 bg-[#149911] rounded-full"></span>
                        <span className="w-2 h-2 bg-[#149911] rounded-full"></span>
                      </div>
                    )}
                    {showDropdown === msg.id && (
                      <div
                        className={`absolute z-10 ${
                          dropdownPosition === "top" ? "bottom-full " : "top-full "
                        } ${isCurrentUserSender ? "-left-4" : "-right-4"} w-auto bg-muted border rounded shadow-lg`}
                      >
                        {isCurrentUserSender ? (
                          <>
                            <button className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
                              Modify
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
                              Delete
                            </button>
                          </>
                        ) : (
                          <button className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
                            Share
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

               {msg?.files && msg.files.map((fileObj) => {
                  const fileURL = fileObj.file;
                  const fileExtension = fileURL?.split('.').pop()?.toLowerCase();

                  if (fileExtension && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'jfif'].includes(fileExtension)) {
                    return <ImagePreview key={fileObj.id} fileURL={fileURL} />;
                  } else if (fileExtension && ['mp4', 'webm', 'ogg'].includes(fileExtension)) {
                    return <VideoPreview key={fileObj.id} fileURL={fileURL} />;
                  } else if (fileExtension && ['mp3', 'wav'].includes(fileExtension)) {
                    return (
                      <audio
                        key={fileObj.id}
                        src={fileURL}
                        controls
                        className="w-20 h-20"
                      />
                    );
                  } else {
                    return (
                      <div key={fileObj.id} className="mt-2">
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
                })}
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
            className="absolute left-4 items-center cursor-pointer text-muted-foreground hover:text-foreground space-x-2"
          >
            <Paperclip className="w-6 h-6 text-[#149911] cursor-pointer" />
          </Label>
          <Input id={"file"} multiple onChange={handleFileChange} className={"w-48"} type={"file"} style={{ display: 'none' }} />
          <Textarea
            ref={textareaRef}
            className="flex-1 resize-none pl-10 pr-8 focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ maxHeight: "120px" }}
          />
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="cursor-pointer text-[#149911] absolute right-2">
            <SmilePlus />
          </button>
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!message.trim() && !filePreviews.length}
          className={`w-6 h-6 cursor-pointer transition-colors ${!message.trim() && !filePreviews.length ? 'hidden' : 'text-[#149911] hover:text-primary'}`}
        >
          <Send />
        </button>
      </footer>

      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-20 right-6">
          <Picker onEmojiClick={handleEmojiSelect} />
        </div>
      )}

     {filePreviews.length > 0 && (
        <div className="absolute bg-muted bottom-20 p-2 rounded-lg flex flex-wrap gap-2">
          <div className="relative inset-0 bg-gray-500 opacity-50 z-10" />
          {files.map((file, index) => {
            const filePreview = filePreviews[index];
            const fileExtension = file.name.split('.').pop()?.toLowerCase();

            if (fileExtension && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'jfif'].includes(fileExtension)) {
              return (
                <div key={index} className="relative flex flex-col items-center text-center">
                  <img src={filePreview} alt="uploaded" className="w-20 h-auto rounded-lg" />
                  <button onClick={() => handleRemoveFile(index)} className="absolute top-0 right-0 text-red-500">
                    ❌
                  </button>
                </div>
              );
            } else if (fileExtension && ['mp4', 'webm', 'ogg'].includes(fileExtension)) {
              return (
                <div key={index} className="relative flex flex-col items-center text-center">
                  <video
                    src={filePreview}
                    className="w-28 h-28 cursor-pointer rounded"
                    onClick={(e) => e.stopPropagation()}
                    muted
                  />
                  <button onClick={() => handleRemoveFile(index)} className="absolute top-0 right-0 text-red-500">
                    ❌
                  </button>
                </div>
              );
            } else if (fileExtension && ['mp3', 'wav'].includes(fileExtension)) {
              return (
                <div key={index} className="relative flex flex-col items-center text-center">
                  <audio
                    src={filePreview}
                    controls
                    className="w-full max-w-xs h-auto z-20 relative"
                  />
                  <button onClick={() => handleRemoveFile(index)} className="absolute top-0 right-0 text-red-500">
                    ❌
                  </button>
                </div>
              );
            } else {
              return (
                <div key={index} className="relative flex flex-col items-center text-center mt-2 z-20">
                  <span className="text-sm">{file.name}</span>
                  <button onClick={() => handleRemoveFile(index)} className="absolute top-0 right-0 text-red-500">
                    ❌
                  </button>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}