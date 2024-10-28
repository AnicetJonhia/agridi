import { useState, useEffect } from "react";
import { ConversationList } from "@/components/chats/ConversationList";
import { ChatWindow } from "@/components/chats/ChatWindow";
import { getConversations, getChatHistory, sendMessage } from "@/services/chats-api";

export default function Chat() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showConversationList, setShowConversationList] = useState(true);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const fetchedConversations = await getConversations(token);
          setConversations(fetchedConversations);
          if (window.innerWidth >= 1008 && fetchedConversations.length > 0) {
            setSelectedConversation(fetchedConversations[0]);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des conversations :", error);
        }
      }
    };
    fetchConversations();
  }, []);


  useEffect(() => {
    const fetchChatHistory = async () => {
      if (selectedConversation) {
        try {
          const token = localStorage.getItem("token");
          const fetchedMessages = await getChatHistory(selectedConversation.group?.id || selectedConversation.receiver?.id, token);
          setMessages(fetchedMessages);

        } catch (error) {
          console.error("Erreur lors de la récupération de l'historique du chat :", error);
        }
      }
    };
    fetchChatHistory();
  }, [selectedConversation]);



  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    if (window.innerWidth < 1008) {
      setShowConversationList(false);
    }
  };

  const handleBack = () => {
    setShowConversationList(true);
  };

  const handleSendMessage = async (content) => {
  if (selectedConversation) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      // Send the message
      const newMessage = await sendMessage(selectedConversation.group?.id || selectedConversation.receiver?.id, content, token);

      // Update messages in the state
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      console.log("newMessage :",newMessage);

      // Update the last message in the conversation list
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === selectedConversation.group?.id || conv.id === selectedConversation.receiver?.id || conv === selectedConversation.id
            ? { ...conv, content: newMessage.content, timestamp: newMessage.timestamp } // Ensure you are updating content and timestamp as needed
            : conv
        )
      );

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
        {showConversationList && (
          <ConversationList conversations={conversations} onSelectConversation={handleSelectConversation} />
        )}
        <div className={`flex flex-col flex-1 ${showConversationList ? 'hidden lg:flex' : 'flex'}`}>
          {selectedConversation && (
            <ChatWindow
              conversation={selectedConversation}
              messages={messages}
              onBack={handleBack}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
