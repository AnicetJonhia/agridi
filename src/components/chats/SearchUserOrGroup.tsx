import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


export function SearchUserOrGroup({ users, groups, onSelectUser, onSelectGroup, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");

  const roleMap = {
    Pro: "Productor",
    Col: "Collector",
    Con: "Consumer",
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
    user.role !== "Admin" &&
    user.role
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user) => {
    onSelectUser(user);
    onClose();
  };

  const handleSelectGroup = (group) => {
    onSelectGroup(group);
    onClose();
  };

  if (users.length === 0 && groups.length === 0) {
    return <div>No users or groups available</div>;
  }

  return (
    <div className={"mt-3"}>
      <Input
        type="text"
        placeholder="Search users or groups..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="overflow-y-scroll h-64">
        {filteredUsers.map(user => (
          <Card
            key={user.id}
            className="flex items-center p-4 cursor-pointer hover:bg-muted mb-2"
            onClick={() => handleSelectUser(user)}
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
            <div className="ml-4 flex-1">
              <div className="font-semibold">{user.username}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
            <div className="ml-auto">
              <span className="text-sm text-gray-400">{roleMap[user.role] || user.role}</span>
            </div>
          </Card>
        ))}
        {filteredGroups.map(group => (
          <Card
            key={group.id}
            className="flex items-center p-4 cursor-pointer hover:bg-muted mb-2"
            onClick={() => handleSelectGroup(group)}
          >
            <Avatar className="w-10 h-10">
              {group.photo ? (
                <img
                  src={group.photo instanceof File ? URL.createObjectURL(group.photo) : group.photo}
                  alt={group.name}
                />
              ) : (
                <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div className="ml-4 flex-1">
              <div className="font-semibold">{group.name}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}