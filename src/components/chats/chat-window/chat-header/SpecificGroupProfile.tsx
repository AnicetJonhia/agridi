import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {
  ChevronRight,
  CircleCheckBig,
  CloudDownload, MessageCircleOff,
  MoveLeft,
  PencilLine,
  Pocket,
  ScanSearch,
  Trash,
  UserRoundPlus,
  Users
} from "lucide-react";
import {Drawer, DrawerClose, DrawerContent,} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Separator} from "@/components/ui/separator.tsx";
import {
  addMembersToGroup,
  deleteConversation,
  getConversations,
  leaveGroup,
  removeMemberFromGroup,
  updateGroup
} from "@/services/chats-api.tsx";
import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import useChatStore from "@/stores/chatStore.ts";
import {Card} from "@/components/ui/card.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import useUserStore from "@/stores/userStore.ts";
import { useSelector } from 'react-redux';
import { RootState } from '@/stores';


const SpecificGroupProfile = ({ group, open, onClose, refreshConversations, setRefreshConversations }) => {
  const [isGroupPhotoDialogOpen, setIsGroupPhotoDialogOpen] = useState(false);
  const [temporaryGroupPhoto, setTemporaryGroupPhoto] = useState<File | null>(null);
  const {specificGroup, fetchSpecificGroup} = useChatStore();
  const [isAddingMembersDialogOpen, setIsAddingMembersDialogOpen] = useState(false);
  const {users} = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
   const token = useSelector((state: RootState) => state.auth.token);



    const handleSelectUser = (userId) => {
    setSelectedMembers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter(id => id !== userId); // Désélectionner
      } else {
        return [...prevSelected, userId]; // Sélectionner
      }
    });
  };




  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
    user.role !== "Admin" &&
    user.role
  );


  const roleMap = {
    Pro: "Productor",
    Col: "Collector",
    Con: "Consumer",
  };

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    members: [],
    owner: "",
    photo: null as string | File | null,
  });

  const currentUserId = Number(localStorage.getItem("userId"));
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(group?.name);





  useEffect(() => {


        const getSpecificGroup = async () => {
          await fetchSpecificGroup(group?.id);
        };
        getSpecificGroup();

      }, [fetchSpecificGroup]);


  useEffect(() => {
    if (specificGroup) {
      setFormData({ ...specificGroup });

    }
  }, [specificGroup]);

  useEffect(() => {
    return () => {
      if (temporaryGroupPhoto) {
        URL.revokeObjectURL(URL.createObjectURL(temporaryGroupPhoto));
      }
    };
  }, [temporaryGroupPhoto]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (refreshConversations) {

        if (token) {
          await getConversations(token);
          setRefreshConversations(false);
        }
      }
    };
    fetchConversations();
  }, [refreshConversations, setRefreshConversations]);


  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleUpdateGroupName = () => {
    if (!groupName) return;

    if (!token) return;
    try{
      const updatedGroupName = { name: groupName };
      updateGroup(group.id, updatedGroupName, token);
      setFormData({ ...formData, name: groupName });
      useChatStore.setState({ specificGroup: updatedGroupName });

      onClose();
        Swal.fire({
            title: "Updated!",
            text: "The group name has been updated successfully.",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
            popup: "bg-muted text-muted-foreground rounded-lg shadow-lg",
            title: "text-foreground font-semibold",
            content: "text-muted-foreground text-sm",
            confirmButton: "bg-primary text-primary-foreground rounded px-4 py-2 hover:bg-primary/90",
            },
            buttonsStyling: false,
        });
    }
    catch (error) {
        console.error("Failed to update group name:", error);
        onClose();
        Swal.fire({
            title: "Error!",
            text: "An error occurred while updating the group name.",
            icon: "error",
            confirmButtonText: "Try Again",
            customClass: {
            popup: "bg-muted text-muted-foreground rounded-lg shadow-lg",
            title: "text-foreground font-semibold",
            content: "text-muted-foreground text-sm",
            confirmButton: "bg-primary text-primary-foreground rounded px-4 py-2 hover:bg-primary/90",
            },
            buttonsStyling: false,
        });
    }


    setIsEditing(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTemporaryGroupPhoto(e.target.files[0]);
    }
  };

  const handleUpdateGroupPhoto = async () => {

    if (!token) return;

    if (temporaryGroupPhoto) {
      const updatedGroupPhotoData = new FormData();
      updatedGroupPhotoData.append('photo', temporaryGroupPhoto);

      try {
        const updatedGroupPhoto = await updateGroup(group.id, { photo: temporaryGroupPhoto }, token);
        setFormData({ ...formData, photo: updatedGroupPhoto.photo });
        setIsGroupPhotoDialogOpen(false);
        useChatStore.setState({ specificGroup: updatedGroupPhoto });

        onClose();
        await Swal.fire({
          title: "Updated!",
          text: "The group photo has been updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            popup: "bg-muted text-muted-foreground rounded-lg shadow-lg",
            title: "text-foreground font-semibold",
            content: "text-muted-foreground text-sm",
            confirmButton: "bg-primary text-primary-foreground rounded px-4 py-2 hover:bg-primary/90",
          },
          buttonsStyling: false,
        });


      } catch (error) {

        console.error('Failed to update profile picture:', error);
        onClose();
        await Swal.fire({
          title: "Error!",
          text: "An error occurred while updating the group photo.",
          icon: "error",
          confirmButtonText: "Try Again",
          customClass: {
            popup: "bg-muted text-muted-foreground rounded-lg shadow-lg",
            title: "text-foreground font-semibold",
            content: "text-muted-foreground text-sm",
            confirmButton: "bg-primary text-primary-foreground rounded px-4 py-2 hover:bg-primary/90",
          },
          buttonsStyling: false,
        });
      }
    }
  };

  const handleLeaveGroup = async () => {

    if (!token) return;

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


  const handleRemoveMemberFromGroup = async (memberId: number) => {

  if (!token) return;
  onClose();
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to remove this member from the group. This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, remove!",
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
      await removeMemberFromGroup(group.id, memberId, token);
      setRefreshConversations(true);

      await Swal.fire({
        title: "Removed!",
        text: "The member has been removed from the group.",
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
      console.error("Failed to remove member from group:", error);

      await Swal.fire({
        title: "Error!",
        text: "An error occurred while removing the member from the group.",
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

  const handleAddMembers = async (memberIds: number[] = selectedMembers) => {

    if (!token) return;
    onClose();
    try {
      if (!Array.isArray(memberIds)) {
      memberIds = Array.isArray(selectedMembers) ? selectedMembers : [];
    }

      await addMembersToGroup(group.id, memberIds, token);
      setRefreshConversations(true);

      await Swal.fire({
        title: "Added!",
        text: "The selected members have been added to the group.",
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
      console.error("Failed to add members to group:", error);

      await Swal.fire({
        title: "Error!",
        text: "An error occurred while adding the members to the group.",
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
  if (!group) return null;

  const isGroupOwner: boolean = group?.owner?.id === currentUserId;

  return (
    <Drawer open={open} onOpenChange={onClose}>

      <DrawerContent>
        <DrawerClose asChild>
          <Button variant={"outline"}
            className="absolute top-2 right-2  h-8 w-8 rounded-full   "
            aria-label="Close"
          >
            ✕
          </Button>
        </DrawerClose>
        <div className="mt-4 border mx-auto w-full max-w-lg rounded-lg rotate-with-origin">
          <div className="flex p-4 flex-col items-center md:flex-row md:items-start">
            {group.photo ? (
              <Avatar onClick={() => setIsGroupPhotoDialogOpen(true)} className="w-32 h-32 cursor-pointer rounded-full">
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
              <Avatar onClick={() => setIsGroupPhotoDialogOpen(true)} className="w-32 cursor-pointer h-32">
                <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div className="mt-4 md:ml-4 flex flex-col items-center md:items-start">
                  {!isEditing ? (
                      <div className={"flex space-x-4 items-center"}>
                        <h2 className=" text-lg font-semibold" >
                          {group.name}
                        </h2>
                        <button onClick={handleEditClick} className="p-2">
                          <PencilLine className="w-full h-4" />
                        </button>
                      </div>
                  ) : (

                      <div className={"flex"}>
                        <div className="flex  items-center space-x-2 flex-1">

                       <button onClick={handleCancelClick} >
                         <MoveLeft className="w-6 h-6 "/>
                       </button>
                       <Input
                           type="text"
                           value={groupName}
                           onChange={(e) => setGroupName(e.target.value)}
                           className="border p-2  rounded w-full"
                       />


                     </div>
                        <Button onClick={handleUpdateGroupName} className="ml-2 p-2  text-white rounded">
                          <CircleCheckBig />
                      </Button>
                        </div>
                  )}

           <div className="flex items-center text-gray-500">
                <Users className="mr-2 h-4 w-4" />
                {group?.members?.length} members
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
                <DropdownMenuContent >
                  <DropdownMenuItem className="flex  space-x-2 justify-between items-center">
                    <span>{group.name} members</span>
                    {isGroupOwner && (
                            <Button variant={"outline"} onClick={() => setIsAddingMembersDialogOpen(true)}>
                              <UserRoundPlus className="popup-animation" />
                            </Button>
                    )}
                  </DropdownMenuItem>
                  <Separator />
                  <div className={"max-h-96 overflow-y-scroll "}>
                    {group.members.map((member, index) => (
                        <DropdownMenuItem className={"mt-2 "} key={index}>
                          <div className="flex mr-5 items-center pulse justify-center space-x-2">
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
                            <div className={"flex  flex-1 flex-col space-y-2"}>
                              <span>{member.username}</span>
                              <span className={"text-muted-foreground text-sm"}>{member.email}</span>
                            </div>

                          </div>
                          {isGroupOwner && (
                              <Button onClick={() => handleRemoveMemberFromGroup(member.id)} variant={"ghost"} className={"ml-auto"}>
                                <Trash className={"w-4"}/>
                              </Button>
                          )}
                        </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <div className={"flex space-x-2"}>
              <Button variant={"outline"} onClick={handleDeleteConversation}>
                <span>Delete Conversation</span>
                <MessageCircleOff  className={"ml-2 w-4"} />
              </Button>
              <Button variant={"destructive"} onClick={handleLeaveGroup}>
                <span>Leave group</span><ChevronRight className={"ml-2 w-4"} />
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={isGroupPhotoDialogOpen} onOpenChange={(open) => setIsGroupPhotoDialogOpen(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{group.name} photo</DialogTitle>
            </DialogHeader>
            <img
               src={
                temporaryGroupPhoto
                  ? URL.createObjectURL(temporaryGroupPhoto)
                  : formData?.photo || group?.photo
              }
              alt={group.name}
              className="w-full h-full object-cover rounded-tl-lg rounded-tr-lg"
            />
            <div className="mt-4 flex flex-col items-start space-y-2">
              <Label
                htmlFor="profile_picture"
                className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground space-x-2"
              >
                <CloudDownload />
                <span>Choose a new {group.name} photo</span>
              </Label>
              <Input
                id="profile_picture"
                type="file"
                onChange={handlePhotoChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            <div className="flex w-full justify-end mt-4">
              {temporaryGroupPhoto && (
                <Button onClick={handleUpdateGroupPhoto} className={"space-x-2"}><span>Update</span> <Pocket /></Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddingMembersDialogOpen} onOpenChange={() => setIsAddingMembersDialogOpen(false)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add members to {group.name}</DialogTitle>
            </DialogHeader>
          <div className="flex flex-col space-y-4 max-h-[80vh]">
            <Input
                type="text"
                placeholder="Search for users ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
            />
            <div className="overflow-y-scroll flex-1 ">
              {filteredUsers.map(user => (
                  <Card
                      key={user.id}
                      className="flex items-center p-4  hover:bg-muted mb-2"

                  >
                    <Avatar className="w-10 h-10">
                      {user.profile_picture ? (
                          <img
                              src={user.profile_picture instanceof File ? URL.createObjectURL(user.profile_picture) : user.profile_picture}
                              alt={user.username}
                          />
                      ) : (
                          <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="ml-4 space-x-4 flex flex-1">
                      <div>
                        <div className="font-semibold">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>

                      </div>
                      <div className={"flex items-center justify-center"}>
                          <span
                              className="text-sm items-center justify-center text-gray-400">{roleMap[user.role] || user.role}</span>

                      </div>
                    </div>
                    <div className="ml-auto">
                       <Checkbox
                          checked={selectedMembers.includes(user.id)}  // Vérifie si l'ID est sélectionné
                          onCheckedChange={(checked) => handleSelectUser(user.id)}   // Gère la sélection/désélection
                        />

                    </div>
                  </Card>
              ))}


            </div>
            <div className="items-center space-x-2 flex flex-row  overflow-x-auto w-full justify-start gap-4">

                {users
                    .filter(user => selectedMembers.includes(user.id)) // Filtrer les utilisateurs sélectionnés
                    .map(user => (
                        <div key={user.id} className="flex flex-col  items-center justify-center space-y-0.5">
                          <Avatar className="w-8 h-8">
                            {user.profile_picture ? (
                                <img
                                    src={user.profile_picture instanceof File ? URL.createObjectURL(user.profile_picture) : user.profile_picture}
                                    alt={user.username}
                                />
                            ) : (
                                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                            )}
                          </Avatar>
                          <p>{user.username}</p>
                        </div>
                    ))}

            </div>
              {selectedMembers.length > 0 && (
              <div className="flex items-center justify-end space-x-2">
                <span className="text-sm text-gray-500 flex-grow text-end ">
                  {`You have selected ${selectedMembers.length} member${selectedMembers.length > 1 ? 's' : ''}.`}
                </span>

                <Button onClick={handleAddMembers} className="mt-4 flex items-center space-x-2">
                  <UserRoundPlus className="w-4 h-4" />
                  <span>{selectedMembers.length === 1 ? 'Add 1 member' : `Add ${selectedMembers.length} members`}</span>
                </Button>
              </div>
            )}


             </div>
        </DialogContent>
        </Dialog>

      </DrawerContent>


    </Drawer>
  );
};

export default SpecificGroupProfile;