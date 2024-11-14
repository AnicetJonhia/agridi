import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoveLeft, BadgeInfo } from "lucide-react";

interface ChatHeaderProps {
  displayName: string;
  displayPhoto: string | null;
  onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ displayName, displayPhoto, onBack }) => (
  <header className="flex items-center justify-start space-x-6 px-4 py-2 border-b">
    <div className="lg:hidden">
      <button onClick={onBack} className="p-2">
        <MoveLeft className="w-6 h-6" />
      </button>
    </div>
    <div className="flex flex-1 items-center space-x-1">
      <Avatar className="w-10 h-10">
        {displayPhoto ? (
          <img src={typeof displayPhoto === "string" ? displayPhoto : URL.createObjectURL(displayPhoto)} alt="A" />
        ) : (
          <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
        )}
      </Avatar>
      <h1 className="text-lg font-semibold">{displayName || "Unknown"}</h1>
    </div>
    <div>
      <button className="p-2">
        <BadgeInfo className="w-6 h-6" />
      </button>
    </div>
  </header>
);

export default ChatHeader;