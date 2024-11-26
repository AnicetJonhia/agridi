
import ChatHeader from "./chat-window/ChatHeader";
import MessageInput from "./chat-window/MessageInput"
import MessageList from "./chat-window/MessageList";
import {Message} from "@/types/chat-type";


interface Conversation {
  id: number;
  group?: { id: number; name: string; photo: string };
  sender: { id: number; username: string; profile_picture: string };
  receiver: { id: number; username: string; profile_picture: string };
}

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (message: string, files: File[]) => void;
  onDeleteMessage: (messageId: number) => void;
  onUpdateMessage: (messageId: number, newContent: string) => void;
  onShareMessage: (message: Message, user: any) => void;
  onDeleteFile: (messageId: number, fileId: number) => void;
   refreshConversations : boolean;
   setRefreshConversations : (refreshConversations : boolean) => void;
}



export function ChatWindow({ conversation, messages, onBack, onSendMessage,onDeleteMessage,onUpdateMessage,onShareMessage, onDeleteFile,  refreshConversations,
  setRefreshConversations, }: ChatWindowProps) {


  const currentUserId = Number(localStorage.getItem("userId"));

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

  const displayId =
    conversation.group?.id ||
    (currentUserId === conversation.receiver?.id
      ? conversation.sender?.id
      : conversation.receiver?.id);



  return (
    <div className="flex flex-col h-full">
      <ChatHeader displayName={displayName} displayPhoto={displayPhoto} userId={conversation.group ? undefined : displayId} groupId={conversation.group ? displayId : undefined} onBack={onBack}
            refreshConversations={refreshConversations}
        setRefreshConversations={setRefreshConversations}
      />

       <MessageList
        messages={messages}
        currentUserId={currentUserId}
        conversation={conversation}
        onDeleteMessage={onDeleteMessage}
        onUpdateMessage={onUpdateMessage}
        onShareMessage={onShareMessage}
        onDeleteFile={onDeleteFile}
      />
      <MessageInput onSendMessage={onSendMessage} />

    </div>
  );
}