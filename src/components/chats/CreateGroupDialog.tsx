import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGroup } from "@/services/chats-api";
import useUserStore from "@/stores/userStore";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { User } from "@/types/chat-type.ts";
import {Images } from "lucide-react";
import AltGroupPhoto from "@/assets/images/chats/alt_group_phot.png"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


interface CreateGroupDialogProps {
  onClose: () => void;
}

export default function CreateGroupDialog({ onClose }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { users, fetchAllUsers } = useUserStore();



  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoto(e.target.files ? e.target.files[0] : null);
  };

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const handleCreateGroup = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoading(true);
      try {
        const selectedUsers = selectedMembers.map(id => users.find(user => user.id === id)).filter(user => user !== undefined) as User[];
        await createGroup(groupName, selectedUsers, photo, token);
        onClose();
        setGroupName("");
        setSelectedMembers([]);
        setPhoto(null);
      } catch (error) {
        console.error("Error creating group:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUnselect = (userId: number) => {
    setSelectedMembers(selectedMembers.filter(id => id !== userId));
  };

  const handleSelect = (userId: number) => {
    if (!selectedMembers.includes(userId)) {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleReset = () => {
    setSelectedMembers([]);
    setSearchTerm("");
  };

  return (
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-semibold ">Create Group</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="group-name">Name:</Label>
            <Input
                id="group-name"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="search-members">Members:</Label>
            <Input
                id="search-members"
                placeholder="Search members"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />


            {selectedMembers.length > 0 && (
                <div className="relative mb-6">
                  <div className="relative flex flex-wrap gap-1 mt-2">
                    {selectedMembers.map((memberId) => {
                      const member = users.find(user => user.id === memberId);
                      return (
                          <Badge key={memberId} className="flex items-center">
                            {member?.username}
                            <button
                                className="ml-1 rounded-full outline-none focus:ring-2"
                                onClick={() => handleUnselect(memberId)}
                            >
                              <X className="h-3 w-3"/>
                            </button>
                          </Badge>
                      );
                    })}
                  </div>
                  <Button
                      variant={"destructive"}
                      onClick={handleReset}
                      className="absolute top-0 right-0 mt-1 mr-1"
                  >
                    <X className="h-4 w-4"/>
                  </Button>
                </div>
            )}

            <div className=" flex flex-wrap  items-center overflow-y-scroll max-h-56 h-auto">
              {searchTerm && filteredUsers.length > 0 && filteredUsers.map((user) => (
                  <div key={user.id} className="flex justify-center items-center m-2">
                    <div className="cursor-pointer flex flex-col justify-center items-center"
                         onClick={() => handleSelect(user.id)}>
                      <Avatar className="w-16 h-16">
                        {user.profile_picture ? (
                            <img
                                src={user.profile_picture instanceof File ? URL.createObjectURL(user.profile_picture) : user.profile_picture}
                                alt={user.username}
                            />
                        ) : (
                            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                        )}
                      </Avatar>
                      <span className="mt-2">{user.username}</span>
                    </div>
                  </div>
              ))}
            </div>

          </div>

          <div>
            <Label htmlFor="upload-photo">Upload Photo:</Label>
            <Input
                id="upload-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
            />
            <div className="mt-2">
              {photo ? (
                  <label htmlFor={"upload-photo"}>
                    <img
                        src={URL.createObjectURL(photo)}
                        alt="Selected"
                        className="cursor-pointer w-16 h-16 object-cover rounded-full"
                    />
                  </label>
              ) : (
                  <label htmlFor="upload-photo">
                    <Images className="w-16 h-16 text-gray-500 cursor-pointer"/>
                  </label>
              )}
            </div>
          </div>

        </div>
        <div className="mt-auto flex justify-end items-end space-x-1">
          <Button variant="outline" onClick={onClose}>Cancel</Button>

          <Button onClick={handleCreateGroup} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
  );
}