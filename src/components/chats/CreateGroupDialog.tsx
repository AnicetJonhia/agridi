import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGroup } from "@/services/chats-api";
import useUserStore from "@/stores/userStore";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { User } from "@/types/chat-type.ts";

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
      <div className="space-y-4">
        <Label htmlFor="group-name">Group Name</Label>
        <Input
          id="group-name"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div>
          <Label htmlFor="search-members">Select Members:</Label>
          <Input
            id="search-members"
            placeholder="Search members"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
          {filteredUsers.length > 0 && filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <span>{user.username}</span>
              <button
                className="rounded-full outline-none focus:ring-2"
                onClick={() => handleSelect(user.id)}
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <div>
          <Label htmlFor="upload-photo">Upload Photo:</Label>
          <Input
            id="upload-photo"
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
          />
        </div>
      </div>
      <div className="mt-auto flex space-x-1">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="outline" onClick={handleReset}>Reset</Button>
        <Button onClick={handleCreateGroup} disabled={isLoading}>
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
}