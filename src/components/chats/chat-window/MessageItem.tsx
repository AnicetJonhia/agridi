import React, { useState } from "react";
import { Message } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Share2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface MessageItemProps {
  message: Message;
  currentUserId: number;
  onDeleteMessage: (messageId: number) => void;
  onUpdateMessage: (messageId: number, newContent: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, currentUserId, onDeleteMessage, onUpdateMessage }) => {
  const [dropdownOpenMessageId, setDropdownOpenMessageId] = useState<number | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editedMessageContent, setEditedMessageContent] = useState<string>("");

  const isCurrentUserSender = message.sender.id === currentUserId;

  const startEditingMessage = (messageId: number, currentContent: string) => {
    setEditingMessageId(messageId);
    setEditedMessageContent(currentContent);
  };

  const handleUpdateMessage = async (messageId: number) => {
    if (editedMessageContent) {
      try {
        onUpdateMessage(messageId, editedMessageContent);
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

  return (
    <div className={`flex items-end space-x-2 ${isCurrentUserSender ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUserSender && (
        <Avatar className={"w-6 h-6"}>
          {message.sender?.profile_picture ? (
            <AvatarImage src={typeof message.sender.profile_picture === "string" ? message.sender.profile_picture : URL.createObjectURL(message.sender.profile_picture)} alt="S" />
          ) : (
            <AvatarFallback>{message.sender.username.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
      )}
      <div className={`flex flex-col space-y-0.5 ${isCurrentUserSender ? 'items-end' : 'items-start'}`}>
        <div className={"flex space-x-2"}>
          {!isCurrentUserSender && message.sender && (
            <p className="text-xs text-muted-foreground">{message.sender.username}</p>
          )}
          <span className={"text-xs text-muted-foreground"}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        {message.content && (
          <div className={"flex space-x-6 items-center "}>
            {isCurrentUserSender && (
              <DropdownMenu open={dropdownOpenMessageId === message.id} onOpenChange={() => toggleDropdown(message.id)}>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <EllipsisVertical className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="animate-slide-down">
                  <DropdownMenuItem asChild onClick={() => { closeDropdown(); startEditingMessage(message.id, message.content); }}>
                    <Button variant="outline" className="cursor-pointer w-full mt-2 p-3">
                      Modify
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild onClick={() => { closeDropdown(); onDeleteMessage(message.id); }}>
                    <Button variant="outline" className="cursor-pointer w-full mt-2 p-3">
                      Delete
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <div className="flex relative">
              <div className={`p-3 rounded-lg -ml-1 -mr-1 ${isCurrentUserSender ? "bg-gradient-to-r from-primary to-[#149911] text-white" : "bg-gradient-to-r from-muted to-transparent"} max-w-full break-words`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {!isCurrentUserSender && (
                <Button variant="gost" size="icon" className="rounded-full">
                  <Share2 className="h-3 w-3 text-muted-foreground " />
                </Button>
              )}
            </div>
          </div>
        )}
        {editingMessageId === message.id && (
          <Dialog open={true} onOpenChange={() => setEditingMessageId(null)}>
            <DialogContent>
              <div className="flex flex-col space-y-2 mt-4">
                <Textarea value={editedMessageContent} onChange={(e) => setEditedMessageContent(e.target.value)} className="w-full p-2 border rounded" style={{ maxHeight: "120px" }} />
                <Button onClick={() => handleUpdateMessage(message.id)} className="w-full mt-2 p-3">
                  Validate
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default MessageItem;