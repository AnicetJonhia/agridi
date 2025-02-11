import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSelector } from 'react-redux';
import { RootState } from '@/stores';


export function SearchConversation({ conversations, onSelectConversation, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
   const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const filteredConversations = conversations.filter((conversation) => {
    const displayName =
        conversation.group?.name ||
        (currentUserId === conversation.receiver?.id
            ? conversation.sender?.username
            : conversation.receiver?.username);
    let messageIncludesSearchTerm
    if (conversation.content){
         messageIncludesSearchTerm = conversation.content.toLowerCase().includes(searchTerm.toLowerCase());
    }


    return displayName.toLowerCase().includes(searchTerm.toLowerCase()) || messageIncludesSearchTerm;

  });

  const handleSelectConversation = (conversation) => {
    onSelectConversation(conversation);
    onClose();
  };

  if(conversations.length === 0) {
    return <div >No conversations available</div>;
  }

  return (
    <div className={"mt-3"}>
      <Input
        type="text"
        placeholder="Search conversations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="overflow-y-scroll h-64">
        {filteredConversations.map((conversation) => {

            const displayName =
                conversation.group?.name ||
                (currentUserId === conversation.receiver?.id
                    ? conversation.sender?.username
                    : conversation.receiver?.username);

          const displayPhoto =
                conversation.group?.photo ||
                (currentUserId === conversation.receiver?.id
                  ? conversation.sender?.profile_picture
                  : conversation.receiver?.profile_picture);

          const contentPreview =
                    conversation.content && conversation.content.length > 30
                        ? `${conversation.content.slice(0, 30)}...`
                        : conversation.content;


          return (
            <Card
              key={conversation.id}
              className="flex items-center p-4 cursor-pointer hover:bg-muted mb-2"
              onClick={() => handleSelectConversation(conversation)}
            >
              <Avatar className="w-10 h-10">
                {displayPhoto ? (
                          <img
                            src={
                              displayPhoto instanceof File
                                ? URL.createObjectURL(displayPhoto)
                                : displayPhoto
                            }
                            alt="A"
                          />
                        ) : (
                          <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                        )}
              </Avatar>
                <div className="ml-4">
                    <div className="font-semibold">{displayName}</div>
                    <div className="text-sm text-muted-foreground">{contentPreview}</div>
                </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}