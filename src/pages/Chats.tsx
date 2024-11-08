import React, { useState, useEffect } from "react";
import { ConversationList } from "@/components/chats/ConversationList";
import { ChatWindow } from "@/components/chats/ChatWindow";
import { getConversations, getChatHistory, sendMessage } from "@/services/chats-api";
import { MessageCirclePlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchConversation } from "@/components/chats/SearchConversation.tsx";
import useUserStore from '@/stores/userStore';
import { SearchUser } from "@/components/chats/SearchUser";
import SpecificUserDialog from "@/components/chats/SpecifcUserDialog";



export default function Chat() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showConversationList, setShowConversationList] = useState(true);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [refreshConversations, setRefreshConversations] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { users, specificUser, fetchAllUsers, fetchSpecificUser } = useUserStore();
  const [isUserDialogOpen, setUserDialogOpen] = useState(false);
  const [isSpecificUserDialogOpen, setSpecificUserDialogOpen] = useState(false);
  const [selectedUserForChat, setSelectedUserForChat] = useState(null);
  const [isChatWindowDialogOpen, setChatWindowDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      await fetchAllUsers();
    };
    fetchProfile();
  }, []);

  const handleSelectUser = (user) => {
    fetchSpecificUser(user.id);
    setSpecificUserDialogOpen(true);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (refreshConversations) {
      fetchConversations();
      setRefreshConversations(false);
    }
  }, [refreshConversations]);

  const fetchConversations = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const fetchedConversations = await getConversations(token);
        const sortedConversations = fetchedConversations.sort((a, b) =>
          new Date(b.timestamp) - new Date(a.timestamp)
        );
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
        const isGroupConversation = Boolean(selectedConversation.group);
        const conversationId = isGroupConversation
          ? selectedConversation.group?.id
          : currentUserId === selectedConversation.receiver?.id
          ? selectedConversation.sender?.id
          : selectedConversation.receiver?.id;

        const type = isGroupConversation ? 'group' : 'private';

        const fetchedMessages = await getChatHistory(type, conversationId, token);

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


  const handleSendMessage = async (content, file) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      return;
    }

    const currentUserId = Number(localStorage.getItem("userId"));
    const isGroupConversation = Boolean(selectedConversation?.group);
    const receiverId = selectedConversation
      ? currentUserId === selectedConversation.receiver?.id
        ? selectedConversation.sender?.id
        : selectedConversation.receiver?.id  || selectedConversation.group?.id
      : selectedUserForChat?.id;

    if (!receiverId) {
      console.error("Receiver ID not found");
      return;
    }

    try {
      const groupId = isGroupConversation ? selectedConversation.group?.id : null;

      const newMessage = await sendMessage(
        groupId,
        receiverId,
        content,
        token,
        file
      );
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const updatedConversation = selectedConversation
        ? {
            ...selectedConversation,
            lastMessage: newMessage,
            timestamp: newMessage.timestamp,
          }
        : {
            id: receiverId,
            receiver: selectedUserForChat,
            lastMessage: newMessage,
            timestamp: newMessage.timestamp,
          };

      setSelectedConversation(updatedConversation);

      setConversations((prevConversations) => {
        const updatedConversations = selectedConversation
          ? prevConversations.map((conv) =>
              conv.id === (selectedConversation.group?.id || selectedConversation.receiver?.id)
                ? updatedConversation
                : conv
            )
          : [...prevConversations, updatedConversation];

        return updatedConversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      });

      setRefreshConversations(true);
      setChatWindowDialogOpen(false); // Close the dialog after sending the message
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  const handleSendMessageToUser = (user) => {

    setSelectedConversation(null);
    const existingConversation = conversations.find(
      (conv) =>
        (conv.sender?.id === user.id || conv.receiver?.id === user.id) &&
        !conv.group
    );

    if (existingConversation) {
      setSelectedConversation(existingConversation);
    } else {
      setSelectedUserForChat(user);
      setMessages([]);
    }

    setSpecificUserDialogOpen(false);
    setChatWindowDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between border-b p-4">
        <h1 className="text-lg font-semibold flex-shrink-0">Chats</h1>
        <div className="ml-auto flex items-center space-x-4">
          <Button className="border-none" variant="outline" onClick={() => setDialogOpen(true)}>
            <Search className="h-5 w-5 text-gray-500 cursor-pointer" aria-hidden="true" />
          </Button>
          <Button onClick={() => setUserDialogOpen(true)}>
            <MessageCirclePlus className="text-white" />
          </Button>
        </div>
      </header>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <SearchConversation
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            onClose={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isUserDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent>
          <SearchUser
            users={users}
            onSelectUser={handleSelectUser}
            onClose={() => setUserDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <SpecificUserDialog
        user={specificUser}
        open={isSpecificUserDialogOpen}
        onClose={() => setSpecificUserDialogOpen(false)}
        onSendMessage={handleSendMessageToUser}
      />

      <Dialog open={isChatWindowDialogOpen} onOpenChange={setChatWindowDialogOpen}>
        <DialogContent className="h-[80vh] overflow-hidden">
          <div className="h-full overflow-y-auto">
            {selectedConversation && (
              <ChatWindow
                conversation={selectedConversation}
                messages={messages}
                onBack={handleBack}
                onSendMessage={handleSendMessage}
              />
            )}
            {selectedUserForChat && (
              <ChatWindow
                conversation={{ receiver: selectedUserForChat }}
                messages={messages}
                onBack={handleBack}
                onSendMessage={handleSendMessage}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

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
          {selectedUserForChat && (
            <ChatWindow
              conversation={{ receiver: selectedUserForChat }}
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