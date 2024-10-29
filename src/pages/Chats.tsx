import { useState, useEffect } from "react";
import { ConversationList } from "@/components/chats/ConversationList";
import { ChatWindow } from "@/components/chats/ChatWindow";
import { getConversations, getChatHistory, sendMessage } from "@/services/chats-api";

export default function Chat() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showConversationList, setShowConversationList] = useState(true);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [refreshConversations, setRefreshConversations] = useState(false);

  // Initial fetch of conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Refetch conversations only when refreshConversations is set to true
  useEffect(() => {
    if (refreshConversations) {
      fetchConversations();
      setRefreshConversations(false); // Reset after fetching to avoid continuous fetching
    }
  }, [refreshConversations]);



  // Fetch conversations function
  const fetchConversations = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const fetchedConversations = await getConversations(token);
        const sortedConversations = fetchedConversations.sort((a, b) =>
          new Date(b.timestamp) - new Date(a.timestamp)
        );

        console.log("Conversations fetched:", sortedConversations);

        setConversations(sortedConversations);
        if (window.innerWidth >= 1008 && fetchedConversations.length > 0) {
          setSelectedConversation(fetchedConversations[0]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des conversations :", error);
      }
    }
  };

  useEffect(() => {
  const fetchChatHistory = async () => {
    if (selectedConversation) {
      try {
        const token = localStorage.getItem("token");
        const currentUserId = Number(localStorage.getItem("userId"));

        // Si c'est une conversation de groupe, utilise l'ID du groupe
        const conversationId = selectedConversation.group
          ? selectedConversation.group?.id // ID de groupe pour une conversation de groupe
          : currentUserId === selectedConversation.receiver?.id
          ? selectedConversation.sender?.id // Si l'utilisateur est le récepteur, utilise l'ID de l'expéditeur
          : selectedConversation.receiver?.id; // Sinon, utilise l'ID du récepteur

        const fetchedMessages = await getChatHistory(conversationId, token);
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

      const currentUserId = Number(localStorage.getItem("userId"));
      const isGroupConversation = Boolean(selectedConversation?.group);

      try {
        const receiverId =
        currentUserId === selectedConversation.receiver?.id
          ? selectedConversation.sender?.id // Si l'utilisateur est le récepteur, utilise l'ID de l'expéditeur
          : selectedConversation.receiver?.id; // Sinon, utilise l'ID du récepteur

        const groupId = isGroupConversation ? selectedConversation.group?.id : null;

        // Vérifier d'abord si currentUserId est sender ou receiver avant de vérifier pour un groupe
        const newMessage = await sendMessage(
          groupId, // Utilise l'ID du groupe ou l'ID du récepteur
          receiverId,
          content,
          token
        );
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        const updatedConversation = {
          ...selectedConversation,
          lastMessage: newMessage,
          timestamp: newMessage.timestamp,
        };

        setSelectedConversation(updatedConversation);

        setConversations((prevConversations) => {
          const updatedConversations = prevConversations.map((conv) =>
            conv.id === (selectedConversation.group?.id || selectedConversation.receiver?.id)
              ? updatedConversation
              : conv
          );

          return updatedConversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        });

        setRefreshConversations(true);
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
