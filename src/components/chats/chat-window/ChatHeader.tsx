import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoveLeft, BadgeInfo } from "lucide-react";
import useUserStore from "@/stores/userStore.ts";
import useChatStore from "@/stores/chatStore.ts";
import SpecificUserProfile from "@/components/chats/chat-window/chat-header/SpecificUserProfile.tsx";
import SpecificGroupProfile from "@/components/chats/chat-window/chat-header/SpecificGroupProfile.tsx";

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
  const [isUserDialogOpen, setUserDialogOpen] = useState(false);
  const [isGroupDialogOpen, setGroupDialogOpen] = useState(false);
  const { specificUser, fetchSpecificUser } = useUserStore();
  const { specificGroup, fetchSpecificGroup } = useChatStore();


  useEffect(() => {
    if (displayName === "Unknown") {
      onBack();
    }
  }, [displayName, onBack]);

  const handleOpenUserDialog = async () => {
    if (userId) {
      await fetchSpecificUser(userId);
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
      <header className="flex items-center justify-start space-x-6 px-4 py-2 border-b">
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
          <button className="p-2" onClick={groupId ? handleOpenGroupDialog : handleOpenUserDialog}>
            <BadgeInfo className="w-6 h-6" />
          </button>
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