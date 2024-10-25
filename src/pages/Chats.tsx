import { useState, useEffect } from "react";
import { SenderList } from "@/components/chats/SenderList";
import { ChatWindow } from "@/components/chats/ChatWindow";
import { getGroups, getMessages, sendMessage } from "@/services/chats-api.tsx";

export default function Chat() {
  const [selectedSender, setSelectedSender] = useState(null);
  const [showSenderList, setShowSenderList] = useState(true);
  const [messages, setMessages] = useState([]);
  const [senders, setSenders] = useState([]); // Pour stocker les senders récupérés

  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const fetchedSenders = await getGroups(token);
          setSenders(fetchedSenders);
          if (window.innerWidth >= 1008 && fetchedSenders.length > 0) {
            setSelectedSender(fetchedSenders[0]);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des groupes :", error);
        }
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedSender) {
        try {
          const token = localStorage.getItem("token");
          const fetchedMessages = await getMessages(selectedSender.id, token);
          setMessages(fetchedMessages);
          console.log(fetchedMessages);
          if (fetchedMessages.length > 0) {
            console.log(fetchedMessages[fetchedMessages.length - 1].sender.username);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des messages :", error);
        }
      }
    };
    fetchMessages();
  }, [selectedSender]);

  const handleSelectSender = (sender) => {
    setSelectedSender(sender);
    if (window.innerWidth < 1008) {
      setShowSenderList(false);
    }
  };

  const handleBack = () => {
    setShowSenderList(true);
  };

  const handleSendMessage = async (content) => {
    if (selectedSender) {
      const token = localStorage.getItem("token");
      try {
        const newMessage = await sendMessage(selectedSender.id, content, token);
        setMessages((prevMessages) => [...prevMessages, newMessage]); // Ajouter le nouveau message à l'état
      } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="border-b p-4">
        <h1 className="text-lg font-semibold">Chats</h1>
      </header>

      <div className="flex flex-1 h-full">
        {showSenderList && (
          <SenderList senders={senders} onSelectSender={handleSelectSender} />
        )}
        <div className={`flex flex-col flex-1 ${showSenderList ? 'hidden lg:flex' : 'flex'}`}>
          {selectedSender && (
            <ChatWindow
              sender={selectedSender}
              messages={messages} // Passer les messages au ChatWindow
              onBack={handleBack}
              onSendMessage={handleSendMessage} // Passer la fonction d'envoi
            />
          )}
        </div>
      </div>
    </div>
  );
}
