import { useState } from "react";
import { SenderList } from "@/components/chats/SenderList.tsx";
import { ChatWindow } from "@/components/chats/ChatWindow.tsx";

export default function Chat() {
  const [selectedSender, setSelectedSender] = useState(null);

  return (
    <div className="flex flex-col h-full">
      {/* Titre en haut */}
      <header className="border-b p-4">
        <h1 className="text-lg font-semibold">Chats</h1>
      </header>

      {/* Contenu principal avec la liste des expéditeurs et la fenêtre de chat */}
      <div className="flex flex-col md:flex-row flex-1 h-full">
        <SenderList onSelectSender={setSelectedSender} />
        <ChatWindow sender={selectedSender} />
      </div>
    </div>
  );
}
