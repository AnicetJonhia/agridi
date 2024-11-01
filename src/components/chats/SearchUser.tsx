import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function SearchUser({ users, onSelectUser, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");


  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user) => {
    onSelectUser(user);
    onClose();
  };

  return (
    <div className={"mt-3"}>
      <Input
        type="text"
        placeholder="Search users..."
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
                      alt={user.username}/>
              ) : (
                  <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
              <div className="ml-4">
              <div className="font-semibold">{user.username}</div>
              <div className="text-sm text-gray-500">{user.role}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
