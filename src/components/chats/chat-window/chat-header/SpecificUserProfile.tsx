import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {Mail, MapPin, Phone, Linkedin, Globe, Info, ChevronRight} from "lucide-react";
import {getConversations, deleteConversation} from "@/services/chats-api.tsx";
import {useEffect} from "react";

import Swal from 'sweetalert2';

const SpecificUserProfile = ({ user, open, onClose, refreshConversations, setRefreshConversations }) => {
  if (!user) return null;

  const roleMap = {
    Pro: "Productor",
    Col: "Collector",
    Con: "Consumer",
  };



  useEffect(() => {
      const fetchConversations = async () => {
        if (refreshConversations) {
          const token = localStorage.getItem('token');
          if (token) {
            await getConversations(token);
            setRefreshConversations(false);
          }
        }
      };
      fetchConversations();
    }, [refreshConversations, setRefreshConversations]);

    const handleDeleteConversation = async () => {
      const token = localStorage.getItem('token');
      const type = "private";
      if (!token) return;
      try {
        await deleteConversation(type, user.id, token);
        setRefreshConversations(true);
        onClose();
        return true;
      } catch (error) {
        console.error('Failed to delete conversation:', error);
        return false;
      }
    };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className="mt-4 border rounded-lg">
          <div className="flex p-4 flex-col items-center md:flex-row md:items-start">
            {user.profile_picture ? (
              <Avatar className="w-32 h-32 rounded-full">
                <img
                  src={
                    user.profile_picture instanceof File
                      ? URL.createObjectURL(user.profile_picture)
                      : user.profile_picture
                  }
                  alt={user.username}
                />
              </Avatar>
            ) : (
              <Avatar className="w-32 h-32">
                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div className="mt-4 md:ml-4 flex flex-col items-center md:items-start">
              <h2 className="text-lg font-semibold">{user.username}</h2>
              <p className="text-muted-foreground">{roleMap[user.role] || user.role}</p>

            </div>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-bl-lg rounded-br-lg border-t space-y-2">
            {user.email && (
              <div className="flex items-center text-gray-500">
                <Mail className="mr-2 h-4 w-4" />
                {user.email}
              </div>
            )}
            {user.address && (
              <div className="flex items-center text-gray-500">
                <MapPin className="mr-2 h-4 w-4" />
                {user.address}
              </div>
            )}
            {user.phone_number && (
              <div className="flex items-center text-gray-500">
                <Phone className="mr-2 h-4 w-4" />
                {user.phone_number}
              </div>
            )}
            {user.linkedin && (
              <div className="flex items-center text-gray-500">
                <Linkedin className="mr-2 h-4 w-4" />
                {user.linkedin}
              </div>
            )}
            {user.website && (
              <div className="flex items-center text-gray-500">
                <Globe className="mr-2 h-4 w-4" />
                {user.website}
              </div>
            )}
            {user.bio && (
              <div className="flex items-center text-gray-500">
                <Info className="mr-2 h-4 w-4" />
                {user.bio}
              </div>
            )}
            <Button variant={"destructive"} onClick={handleDeleteConversation}>
              <span>Delete Conversation</span><ChevronRight className={"ml-2 w-4"} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpecificUserProfile;