import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem} from "@/components/ui/select";
import { createGroup } from "@/services/chats-api";
import useUserStore from "@/stores/userStore";

interface CreateGroupDialogProps {
  onClose: () => void;
}

export default function CreateGroupDialog({ onClose }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { users, fetchAllUsers } = useUserStore();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleCreateGroup = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await createGroup(groupName, selectedMembers, photo, token);
        onClose();
        setGroupName("");
        setSelectedMembers([]);
        setPhoto(null);
      } catch (error) {
        console.error("Error creating group:", error);
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
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
          <Select
            multiple
            value={selectedMembers}
            onChange={(e) =>
              setSelectedMembers(Array.from(e.target.selectedOptions, option => option.value))
            }
          >
            <SelectContent>
              {filteredUsers.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <Button onClick={handleCreateGroup}>Create</Button>
      </div>
    </div>
  );
}