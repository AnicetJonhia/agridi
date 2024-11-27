import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, ScanSearch, UserRoundPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator.tsx";
import {updateGroup, leaveGroup, getConversations, deleteConversation } from "@/services/chats-api.tsx";
import { useEffect } from "react";
import Swal from "sweetalert2";

const SpecificGroupProfile = ({ group, open, onClose, refreshConversations, setRefreshConversations }) => {
  const currentUserId = Number(localStorage.getItem("userId"));

  if (!group) return null;
 const isGroupOwner: boolean = group?.owner === currentUserId;

  useEffect(() => {
    const fetchConversations = async () => {
      if (refreshConversations) {
        const token = localStorage.getItem('token');
        if (token) {
          await getConversations(token);
          setRefreshConversations(false);
        }
      }
    };
    fetchConversations();
  }, [refreshConversations, setRefreshConversations]);



 const handleLeaveGroup = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  // Ferme le Dialog avant d'afficher Swal
  onClose();

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to leave the group. This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, leave!",
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
        await deleteConversation("group", group.id, token);

        await leaveGroup(group.id, token);
        setRefreshConversations(true);

        await Swal.fire({
          title: "Left Group",
          text: "You have successfully left the group.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            popup: "bg-muted text-muted-foreground rounded-lg",
            title: "text-foreground",
            content: "text-muted-foreground",
            confirmButton: "bg-primary text-primary-foreground rounded",
          },
        });

    } catch (error) {
      console.error("Failed to leave group:", error);

      await Swal.fire({
        title: "Error!",
        text: "An error occurred while leaving the group.",
        icon: "error",
        confirmButtonText: "Try Again",
        customClass: {
          popup: "bg-muted text-muted-foreground rounded-lg",
          title: "text-foreground",
          content: "text-muted-foreground",
          confirmButton: "bg-primary text-primary-foreground rounded",
        },
      });
    }
  }
};


  const handleDeleteConversation = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
       onClose();
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
          await deleteConversation("group", group.id, token);
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
          onClose();
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



  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className="mt-4 border rounded-lg">
          <div className="flex p-4 flex-col items-center md:flex-row md:items-start">
            {group.photo ? (
              <Avatar className="w-32 h-32 rounded-full">
                <img
                  src={
                    group.photo instanceof File
                      ? URL.createObjectURL(group.photo)
                      : group.photo
                  }
                  alt={group.name}
                />
              </Avatar>
            ) : (
              <Avatar className="w-32 h-32">
                <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div className="mt-4 md:ml-4 flex flex-col items-center md:items-start">
              <h2 className="text-lg font-semibold">{group.name}</h2>
              <div className="flex items-center text-gray-500">
                <Users className="mr-2 h-4 w-4" />
                {group.members.length} members
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-bl-lg rounded-br-lg border-t space-y-2">
            {group.members && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center text-gray-500 cursor-pointer">
                    <ScanSearch className="mr-2 h-4 w-4" />
                    View all members
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="flex space-x-2 justify-between items-center">
                    <span>{group.name} members</span>
                    {isGroupOwner && (
                      <Button variant={"outline"}>
                      <UserRoundPlus className="popup-animation" />
                    </Button>
                    )
                    }
                  </DropdownMenuItem>
                  <Separator />
                  <div className={"max-h-96  overflow-y-scroll"}>
                    {group.members.map((member, index) => (
                    <DropdownMenuItem className={"mt-2"} key={index}>
                      <div className="flex items-center">
                        <Avatar className="w-8 h-8 mr-2">
                          {member.profile_picture ? (
                            <img
                              src={
                                member.profile_picture instanceof File
                                  ? URL.createObjectURL(member.profile_picture)
                                  : member.profile_picture
                              }
                              alt={member.username}
                            />
                          ) : (
                            <AvatarFallback>{member.username.charAt(0)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div className={"flex flex-col space-y-2"}>
                          <span>{member.username}</span>
                          <span className={"text-muted-foreground text-sm"}>{member.email}</span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <div className={"flex space-x-2"}>
              <Button variant={"outline"} onClick={handleDeleteConversation}>
                <span>Delete Conversation</span>
            </Button>
            <Button variant={"destructive"} onClick={handleLeaveGroup}>
              <span>Leave group</span><ChevronRight className={"ml-2 w-4"} />
            </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpecificGroupProfile;