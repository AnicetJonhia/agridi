import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {BadgeInfo,  MoveLeft, Paperclip, Send, SmilePlus} from "lucide-react";
import Picker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import ImagePreview from "@/components/utils/ImagePreview.tsx";
import { Input } from "@/components/ui/input";

import VideoPreview from "@/components/utils/VideoPreview.tsx";
import { Label } from "@/components/ui/label.tsx";
import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,

  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {updateMessage} from "@/services/chats-api.tsx";
import { Dialog, DialogContent } from "@/components/ui/dialog";



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
  onDeleteMessage: (messageId: number) => void;
  onUpdateMessage: (messageId: number, newContent: string) => void;
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-En", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(date));
};

export function ChatWindow({ conversation, messages, onBack, onSendMessage,onDeleteMessage,onUpdateMessage }: ChatWindowProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const currentUserId = Number(localStorage.getItem("userId"));

  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const textareaRef2 = useRef<HTMLTextAreaElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  const msgContentRef = useRef<HTMLDivElement | null>(null);


  const [dropdownOpenMessageId, setDropdownOpenMessageId] = useState<number | null>(null);


  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
    const [editedMessageContent, setEditedMessageContent] = useState<string>("");

    const startEditingMessage = (messageId: number, currentContent: string) => {
      setEditingMessageId(messageId);
      setEditedMessageContent(currentContent);
    };

    const handleUpdateMessage = async (messageId: number) => {

      if (editedMessageContent) {
        try {
          onUpdateMessage( messageId, editedMessageContent);

          setEditingMessageId(null);
          setEditedMessageContent("");
        } catch (error) {
          console.error("Failed to update message:", error);
        }
      }
    };

  const closeDropdown = () => {
    setDropdownOpenMessageId(null);
  };

  const toggleDropdown = (messageId: number) => {
    setDropdownOpenMessageId((prevId) => (prevId === messageId ? null : messageId));
  };



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
      if (textareaRef2.current) {
        textareaRef2.current.style.height = "auto";
        textareaRef2.current.style.height = `${Math.min(textareaRef2.current.scrollHeight, 5 * 24)}px`;
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


             <div className={`flex flex-col space-y-0.5 ${isCurrentUserSender ? 'items-end' : 'items-start'}`}>
                  <div className={"flex space-x-2"}>
                    {!isCurrentUserSender && msg.sender && conversation?.group && (
                      <p className="text-xs text-muted-foreground">{msg.sender.username}</p>
                    )}
                    <span className={"text-xs text-muted-foreground"}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {msg.content && (
                    <div className={"flex space-x-6 items-center "}>
                      {isCurrentUserSender && (
                        <DropdownMenu  open={dropdownOpenMessageId === msg.id} onOpenChange={() => toggleDropdown(msg.id)}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                              <EllipsisVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="animate-slide-down">
                            <DropdownMenuItem asChild onClick={() => { closeDropdown(); startEditingMessage(msg.id, msg.content); }}>
                              <Button variant="outline" className="w-full mt-2 p-3">
                                Modify
                              </Button>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild onClick={() => { closeDropdown(); onDeleteMessage(msg.id); }}>
                              <Button variant="outline" className="w-full mt-2 p-3">
                                Delete
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      <div className="flex relative" ref={msgContentRef}>
                        {!isCurrentUserSender && (
                          <div className="flex items-end space-x-0">
                            <span className="w-2 h-2 bg-muted rounded-full"></span>
                            <span className="w-3 h-3 bg-muted rounded-full"></span>
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-lg -ml-1 -mr-1 ${
                            isCurrentUserSender
                              ? "bg-gradient-to-r from-primary to-[#149911] text-white"
                              : "bg-gradient-to-r from-muted to-transparent"
                          } max-w-full break-words`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{formatMessageContent(msg.content)}</p>
                        </div>
                        {isCurrentUserSender && (
                          <div className="flex items-end space-x-0">
                            <span className="w-3 h-3 bg-[#149911] rounded-full"></span>
                            <span className="w-2 h-2 bg-[#149911] rounded-full"></span>
                          </div>
                        )}
                      </div>
                      {!isCurrentUserSender && (
                        <DropdownMenu open={dropdownOpenMessageId === msg.id} onOpenChange={() => toggleDropdown(msg.id)}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                              <EllipsisVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="animate-slide-down">
                            <DropdownMenuItem asChild onClick={closeDropdown}>
                              <Button variant="outline" className="w-full mt-2 p-3">
                                Share
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  )}




                {editingMessageId === msg.id && (
                  <Dialog  open={true} onOpenChange={() => setEditingMessageId(null)}>


                    <DialogContent>
                      <div className="flex flex-col space-y-2 mt-4">
                        <Textarea
                            ref={textareaRef2}
                          value={editedMessageContent}
                          onChange={(e) => setEditedMessageContent(e.target.value)}
                          className="w-full p-2 border rounded"
                          style={{ maxHeight: "120px" }}
                        />
                        <Button onClick={() => handleUpdateMessage(msg.id)} className="w-full mt-2 p-3">
                          Validate
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

               <div className={`flex flex-col space-y-2 ${isCurrentUserSender ? 'items-end' : 'items-start'}`}>
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