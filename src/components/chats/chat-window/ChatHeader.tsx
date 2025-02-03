import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {MoveLeft, BadgeInfo, MessageCircleOff} from "lucide-react";
import useUserStore from "@/stores/userStore.ts";
import useChatStore from "@/stores/chatStore.ts";
import SpecificUserProfile from "@/components/chats/chat-window/chat-header/SpecificUserProfile.tsx";
import SpecificGroupProfile from "@/components/chats/chat-window/chat-header/SpecificGroupProfile.tsx";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";
import { deleteConversation } from "@/services/chats-api.tsx";
import { useSelector } from 'react-redux';
import { RootState } from '@/stores';


interface ChatHeaderProps {
  displayName: string;
  displayPhoto: string | null;
  userId?: number;
  groupId?: number;
  onBack: () => void;
    refreshConversations: boolean;
    setRefreshConversations: (refreshConversations: boolean) => void;

}

const ChatHeader: React.FC<ChatHeaderProps> = ({ displayName, displayPhoto, userId, groupId, onBack, refreshConversations,
  setRefreshConversations }) => {
    const token = useSelector((state: RootState) => state.auth.token);
  const [isUserDialogOpen, setUserDialogOpen] = useState(false);
  const [isGroupDialogOpen, setGroupDialogOpen] = useState(false);
  const { specificUser, fetchSpecificUser } = useUserStore();
  const { specificGroup, fetchSpecificGroup } = useChatStore();


  const handleDeleteConversation = async () => {

  if (!token) return;



  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Deleting this conversation will permanently remove it.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete!",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "bg-muted text-muted-foreground rounded-lg",
      title: "text-foreground",
      content: "text-muted-foreground",
      confirmButton: "bg-primary text-primary-foreground rounded",
      cancelButton: "bg-destructive text-destructive-foreground rounded",
    },
  });

  if (result.isConfirmed) {
    try {
      const type = specificUser ? "private" : "group";
      const id = specificUser ? specificUser?.id : specificGroup?.id;
      await deleteConversation(type, id, token);
      setRefreshConversations(true);
      await Swal.fire({
        title: "Deleted!",
        text: "The conversation has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup: "bg-muted text-muted-foreground rounded-lg",
          title: "text-foreground",
          content: "text-muted-foreground",
          confirmButton: "bg-primary text-primary-foreground rounded",
        },
      });

      return true;
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      await Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the conversation.",
        icon: "error",
        confirmButtonText: "Try Again",
        customClass: {
          popup: "bg-muted text-muted-foreground rounded-lg",
          title: "text-foreground",
          content: "text-muted-foreground",
          confirmButton: "bg-primary text-primary-foreground rounded",
        },
      });
      return false;
    }
  }
};

  useEffect(() => {
    if (displayName === "Unknown") {
      onBack();
    }
  }, [displayName, onBack]);

  const handleOpenUserDialog = async () => {
    if (userId) {
      await fetchSpecificUser(token, userId);
      setUserDialogOpen(true);
    }
  };

  const handleOpenGroupDialog = async () => {
    if (groupId) {
      await fetchSpecificGroup(groupId);
      setGroupDialogOpen(true);
    }
  };

  const handleCloseUserDialog = () => {
    setUserDialogOpen(false);
  };

  const handleCloseGroupDialog = () => {
    setGroupDialogOpen(false);
  };

  return (
    <>
      <header className="flex slide-in-right items-center justify-start space-x-6 px-4 py-2 border-b">
        <div className="lg:hidden">
          <button onClick={onBack} className="p-2">
            <MoveLeft className="w-6 h-6" />
          </button>
        </div>
        <div className=" cursor-pointer flex flex-1 items-center space-x-1" onClick={userId ? handleOpenUserDialog : handleOpenGroupDialog}>
          <Avatar className="w-10 h-10">
            {displayPhoto ? (
              <img src={typeof displayPhoto === "string" ? displayPhoto : URL.createObjectURL(displayPhoto)} alt="A" />
            ) : (
              <AvatarFallback>{displayName ? displayName.charAt(0) : "U"}</AvatarFallback>
            )}
          </Avatar>
          <h1 className="text-lg font-semibold">{displayName ? displayName : "Unknown"}</h1>
        </div>
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                <button className="p-2">
                    <BadgeInfo className="w-6 h-6" />
                </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
              <DropdownMenuItem  className={"cursor-pointer"} onClick={handleDeleteConversation}>
                <span>Delete conversation</span> <MessageCircleOff  className={"ml-2 w-4"} />
              </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>

      <SpecificUserProfile
        user={specificUser}
        open={isUserDialogOpen}
        onClose={handleCloseUserDialog}
                refreshConversations={refreshConversations}
        setRefreshConversations={setRefreshConversations}

      />

      <SpecificGroupProfile
        group={specificGroup}
        open={isGroupDialogOpen}
        onClose={handleCloseGroupDialog}
              refreshConversations={refreshConversations}
        setRefreshConversations={setRefreshConversations}

      />
    </>
  );
};

export default ChatHeader;