import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export function ConversationList({ conversations, onSelectConversation }) {
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const currentUserId  = Number(localStorage.getItem("userId"));


    const handleSelectConversation = (conversation) => {
        setSelectedConversationId(conversation.id);
        onSelectConversation(conversation);
    };

    const calculateTimeAgo = (timestamp) => {
        const now = Date.now();
        const secondsAgo = Math.floor((now - new Date(timestamp).getTime()) / 1000);

        if (secondsAgo < 60) {
            return `${secondsAgo}s ago`;
        } else if (secondsAgo < 3600) {
            const minutesAgo = Math.floor(secondsAgo / 60);
            return `${minutesAgo}min${minutesAgo === 1 ? '' : 's'} ago`;
        } else if (secondsAgo < 86400) {
            const hoursAgo = Math.floor(secondsAgo / 3600);
            return `${hoursAgo}hr${hoursAgo === 1 ? '' : 's'} ago`;
        } else {
            const daysAgo = Math.floor(secondsAgo / 86400);
            return `${daysAgo}day${daysAgo === 1 ? '' : 's'} ago`;
        }
    };

    return (
        <div className="w-full lg:w-1/3 border-r p-2 overflow-y-scroll h-full">
            {conversations.map((conversation) => {

                const displayName =
                    currentUserId === conversation.receiver?.id
                        ? conversation.sender?.username // Affiche le nom de l'expéditeur
                        : conversation.receiver?.username || conversation.group?.name; // Sinon, affiche le nom du destinataire ou le nom du groupe

                return (
                    <Card
                        key={conversation.id + conversation.timestamp}
                        className={`flex flex-col p-4 cursor-pointer hover:bg-muted mb-2 ${selectedConversationId === conversation.id ? 'bg-muted' : ''}`}
                        onClick={() => handleSelectConversation(conversation)}
                    >
                        {conversation.id && (
                            <div className="flex items-center">
                                <Avatar className="w-10 h-10">
                                    <AvatarFallback>
                                        {conversation.group?.name.charAt(0) ||
                                         (currentUserId === conversation.receiver?.id
                                             ? conversation.sender?.username.charAt(0)
                                             : conversation.receiver?.username.charAt(0))}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="ml-4 flex-1">
                                    <div className="font-semibold">
                                        {displayName}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{conversation.content}</div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {calculateTimeAgo(conversation.timestamp)}
                                </div>
                            </div>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
