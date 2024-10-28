import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export function ConversationList({ conversations, onSelectConversation }) {
    const [selectedConversationId, setSelectedConversationId] = useState(null);

    const handleSelectConversation = (conversation) => {
        setSelectedConversationId(conversation.id);
        onSelectConversation(conversation);
    };

    return (
        <div className="w-full lg:w-1/3 border-r p-2 overflow-y-scroll h-full">
            {conversations.map((conversation) => (
                <Card
                    key={conversation.id}
                    className={`flex flex-col p-4 cursor-pointer hover:bg-muted mb-2 ${selectedConversationId === conversation.id ? 'bg-muted' : ''}`}
                    onClick={() => handleSelectConversation(conversation)} // Utilisez la nouvelle fonction pour gérer la sélection
                >
                    {conversation.id && (
                        <div className="flex items-center">
                            <Avatar className="w-10 h-10">
                                <AvatarFallback>{conversation.group?.name.charAt(0) || conversation.receiver?.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 flex-1">
                                <div className="font-semibold">{conversation.group?.name || conversation.receiver?.username}</div>
                                <div className="text-sm text-muted-foreground">{conversation.content}</div>
                            </div>
                            <div className="text-xs text-muted-foreground">{conversation.timestamp}</div>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}
