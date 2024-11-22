import { useState, useEffect } from "react";
import { ConversationList } from "@/components/chats/ConversationList";
import { ChatWindow } from "@/components/chats/ChatWindow";
import {createGroup,getConversations, getChatHistory, sendMessage, deleteMessage, deleteFile, updateMessage} from "@/services/chats-api";
import { MessageCirclePlus, MessageSquareText, Search, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchConversation } from "@/components/chats/SearchConversation.tsx";
import useUserStore from '@/stores/userStore';

import { SearchUser } from "@/components/chats/SearchUser";
import SpecificUserDialog from "@/components/chats/SpecifcUserDialog";
import {Message, User} from "@/types/chat-type";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import{Separator} from "@/components/ui/separator";
import CreateGroupDialog from "@/components/chats/CreateGroupDialog";
import {Toaster} from "@/components/ui/toaster.tsx";
import { useToast } from "@/hooks/use-toast.ts";

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
  const [isCreateGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
    const { toast } = useToast();


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


   const handleCreateGroup = async (groupName: string, selectedMembers: number[], photo: File | null) => {
    if (selectedMembers.length < 2) {
      toast({
        description: "Group must have at least 2 members",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const selectedUsers = selectedMembers
          .map(id => users.find(user => user.id === id))
          .filter(user => user !== undefined) as User[];
        await createGroup(groupName, selectedUsers, photo, token);
        toast({
          description: "Group created successfully",
          variant: "success",
        });
        setCreateGroupDialogOpen(false);
        setRefreshConversations(true);
      } catch (error) {
        console.error("Error creating group:", error);
      }
    }
  };

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


  const handleSendMessage = async (content, files) => {
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
          : selectedConversation.receiver?.id || selectedConversation.group?.id
        : selectedUserForChat?.id;

      if (!receiverId && !isGroupConversation) {
        console.error("Receiver ID not found");
        return;
      }

      try {
        const groupId = isGroupConversation ? selectedConversation.group?.id : null;

        const newMessage = await sendMessage(
          groupId,
          isGroupConversation ? null : receiverId,
          content,
          token,
          files
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
        setChatWindowDialogOpen(false);
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


  const handleDeleteMessage = async (messageId: number) => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      try {
           await deleteMessage(token, messageId);
           setRefreshConversations(true);

      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }



    const handleDeleteFile = async (messageId: number, fileId: number) => {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("Token not found");
            return;
          }

          try {
            await deleteFile(token, messageId, fileId);
            setRefreshConversations(true);
          } catch (error) {
            console.error("Error deleting file:", error);
          }
    };

    const handleUpdateMessage = async (messageId: number, content: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return;
        }

        try {
            await updateMessage(token, messageId, content);
            setRefreshConversations(true);
        } catch (error) {
            console.error("Error updating message:", error);
        }
    }


   const handleShareMessage = async (message: Message, user: any, group: any) => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const receiverId = user?.id;
      const groupId = group?.id;

      if (!receiverId && !groupId) {
        console.error("Receiver ID or Group ID not found");
        return;
      }

      let fileToShare = message.file;

      if (typeof fileToShare === 'string') {
        // fileObj is a URL, fetch the file
        const response = await fetch(fileToShare);
        const blob = await response.blob();
        const fileName = fileToShare.split('/').pop() || 'shared_file';
        fileToShare = new File([blob], fileName, { type: blob.type });
      }

      try {
        const newMessage = await sendMessage(
          groupId || null,
          receiverId || null,
          message?.content,
          token,
          [fileToShare]
        );

        setMessages((prevMessages) => [...prevMessages, newMessage]);

        const updatedConversation = {
          id: groupId || receiverId,
          receiver: user,
          lastMessage: newMessage,
          timestamp: newMessage.timestamp,
        };

        setSelectedConversation(updatedConversation);

        setConversations((prevConversations) => {
          const updatedConversations = [...prevConversations, updatedConversation];
          return updatedConversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        });

        setRefreshConversations(true);
        setChatWindowDialogOpen(false);
      } catch (error) {
        console.error("Error sharing message:", error);
      }
    };

  return (
    <div className="flex flex-col h-full">
        <Toaster />
      <header className="flex items-center justify-between border-b p-4">
        <h1 className="text-lg font-semibold flex-shrink-0">Chats</h1>
        <div className="ml-auto flex items-center space-x-4">
          <Button className="border-none" variant="outline" onClick={() => setDialogOpen(true)}>
            <Search className="h-5 w-5 text-gray-500 cursor-pointer" aria-hidden="true" />
          </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <MessageCirclePlus className="text-white popup-animation" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className={"cursor-pointer mt-2"} onClick={() => setUserDialogOpen(true)}>
                  <MessageSquareText className={"w-4 h-auto"}/> <span className={"ml-2"}>Add Conversation</span>
                </DropdownMenuItem>
                  <Separator className={"mt-2"}/>
                <DropdownMenuItem className={"cursor-pointer mt-2"} onClick={() => setCreateGroupDialogOpen(true)}>
                    <UsersRound className={"w-4 h-auto"} /> <span className={"ml-2"}>Create Group</span>
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>

        <Dialog open={isCreateGroupDialogOpen} onOpenChange={setCreateGroupDialogOpen}>
        <DialogContent>
          <CreateGroupDialog onClose={() => setCreateGroupDialogOpen(false)} onCreateGroup={handleCreateGroup} users={users} />
        </DialogContent>
      </Dialog>

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
            {(selectedConversation || selectedUserForChat) && (
                <ChatWindow
                  conversation={selectedConversation || { receiver: selectedUserForChat }}
                  messages={messages}
                  onBack={handleBack}
                  onSendMessage={handleSendMessage}
                  onDeleteMessage={handleDeleteMessage}
                  onUpdateMessage={handleUpdateMessage}
                  onShareMessage={handleShareMessage}
                  onDeleteFile={handleDeleteFile}
                />
              )}
          </div>
        </DialogContent>
      </Dialog>

      {conversations.length > 0 ? (
          <div className="flex flex-1 h-full">
            {showConversationList && (
                <ConversationList conversations={conversations} onSelectConversation={handleSelectConversation}/>
            )}
            <div className={`flex flex-col flex-1 ${showConversationList ? 'hidden lg:flex' : 'flex'}`}>
              {(selectedConversation || selectedUserForChat) && (
                  <ChatWindow
                      conversation={selectedConversation || {receiver: selectedUserForChat}}
                      messages={messages}
                      onBack={handleBack}
                      onSendMessage={handleSendMessage}
                      onDeleteMessage={handleDeleteMessage}
                      onUpdateMessage={handleUpdateMessage}
                      onShareMessage={handleShareMessage}
                      onDeleteFile={handleDeleteFile}
                  />
              )}
            </div>
          </div>
      ) :(
          <>

            <div
                className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
                x-chunk="dashboard-02-chunk-1"
            >
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                        You have no conversations
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Start a conversation with a user
                    </p>
                    <Button onClick={() => setUserDialogOpen(true)} className="mt-4  ">Add Conversations</Button>
                </div>
            </div>
        </>
      )}
    </div>
  );
}