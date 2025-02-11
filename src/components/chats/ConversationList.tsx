import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '@/stores';


export function ConversationList({ conversations, onSelectConversation }) {
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const currentUserId  = useSelector((state: RootState) => state.auth.user?.id);

    if (!conversations) {
        return <div>No conversations available</div>;
    }

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
             {conversations && conversations.map((conversation) => {


                const displayName =
                    conversation.group?.name ||
                    (currentUserId === conversation.receiver?.id ? conversation.sender?.username : conversation.receiver?.username);

               const contentPreview =
                  conversation.files && conversation.files.length > 0
                    ? currentUserId === conversation.sender?.id
                      ? `you have sent ${conversation.files.length} files`
                      : `${displayName} has sent ${conversation.files.length} files`
                    : conversation.content && conversation.content.length > 30
                    ? `${conversation.content.slice(0, 30)}...`
                    : conversation.content;


                return (
                    <Card
                        key={conversation.id + conversation.timestamp}
                        className={` fade-slide-up flex flex-col p-4 cursor-pointer hover:bg-muted mb-2 ${selectedConversationId === conversation.id ? 'bg-muted' : ''}`}
                        onClick={() => handleSelectConversation(conversation)}
                    >
                        {conversation.id && (
                            <div className="flex items-center ">
                                <Avatar className="w-10 h-10">

                                        {conversation.group?.photo ? (
                                            <img src={
                                                conversation.group.photo instanceof File ? URL.createObjectURL(conversation.group.photo) : conversation.group.photo
                                            } alt="Gr" />
                                        ) : conversation.group?.name ? (
                                            <AvatarFallback>{conversation.group?.name.charAt(0)}</AvatarFallback>
                                        ) : currentUserId === conversation.receiver?.id ? (
                                            conversation.sender?.profile_picture ? (
                                                <img
                                                    src={
                                                        conversation.sender.profile_picture instanceof File
                                                            ? URL.createObjectURL(conversation.sender.profile_picture)
                                                            : conversation.sender.profile_picture
                                                    }
                                                    alt="Sd"
                                                />
                                            ) : (
                                                <AvatarFallback>{conversation.sender?.username.charAt(0)}</AvatarFallback>
                                            )
                                        ) : conversation.receiver?.profile_picture ? (
                                            <img
                                                src={
                                                    conversation.receiver.profile_picture instanceof File
                                                        ? URL.createObjectURL(conversation.receiver.profile_picture)
                                                        : conversation.receiver.profile_picture
                                                }
                                                alt="Rv"
                                            />
                                        ) : (
                                            <AvatarFallback>{conversation.receiver?.username.charAt(0)}</AvatarFallback>
                                        )}


                                </Avatar>
                                <div className="ml-4 flex-1">
                                    <div className="font-semibold">
                                        {displayName}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{contentPreview}</div>
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
