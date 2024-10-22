import { useState, useEffect } from "react";
import { SenderList } from "@/components/chats/SenderList";
import { ChatWindow } from "@/components/chats/ChatWindow";
import { Button } from "@/components/ui/button";
import { senders } from "@/components/chats/SenderList.tsx";

export default function Chat() {
  const [selectedSender, setSelectedSender] = useState(null);
  const [showSenderList, setShowSenderList] = useState(true);

  useEffect(() => {
    // Select the first sender by default on large screens
    if (window.innerWidth >= 768 && senders.length > 0) {
      setSelectedSender(senders[0]);
    }
  }, []);

  const handleSelectSender = (sender) => {
    setSelectedSender(sender);
    if (window.innerWidth < 768) {
      setShowSenderList(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="border-b p-4">
        <h1 className="text-lg font-semibold">Chats</h1>
      </header>

      <div className="flex flex-1 h-full">
        {showSenderList && (
          <SenderList onSelectSender={handleSelectSender} />
        )}
        <div className={`flex flex-col flex-1 ${showSenderList ? 'hidden md:flex' : 'flex'}`}>
          {window.innerWidth < 768 && !showSenderList && (
            <Button
              className="md:hidden p-2"
              onClick={() => setShowSenderList(true)}
            >
              Back to Senders
            </Button>
          )}
          {selectedSender && <ChatWindow sender={selectedSender} />}
        </div>
      </div>
    </div>
  );
}