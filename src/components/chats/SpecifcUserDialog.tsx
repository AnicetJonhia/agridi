import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Linkedin, Globe, Info, Send } from "lucide-react";

const UserProfileDialog = ({ user, open, onClose }) => {
  if (!user) return null;


  const roleMap = {
    Pro: "Productor",
    Col: "Collector",
    Con: "Consumer",
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className=" mt-4 border rounded-lg">
          <div className="flex p-4 flex-col items-center md:flex-row md:items-start">

              {user.profile_picture ? (

                  <Avatar className="w-32 h-auto  rounded-full">
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
                  <Avatar className={"w-32 h-32"}><AvatarFallback>{user.username.charAt(0)}</AvatarFallback></Avatar>

              )}

            <div className="mt-4  md:ml-4 flex flex-col items-center md:items-start">
              <h2 className="text-lg font-semibold">{user.username}</h2>
              <p className="text-muted-foreground">{roleMap[user.role] || user.role}</p>
              <Button className="mt-4 text-white">
                <Send className="mr-2 h-4 w-4"/>
                Send Message
              </Button>
            </div>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-bl-lg rounded-br-lg border-t space-y-2">
            <div className="flex items-center text-gray-500">
              <Mail className="mr-2 h-4 w-4"/>
              {user.email}
            </div>
            <div className="flex items-center text-gray-500">
              <MapPin className="mr-2 h-4 w-4" />
              {user.address}
            </div>
            <div className="flex items-center text-gray-500">
              <Phone className="mr-2 h-4 w-4" />
              {user.phone_number}
            </div>
            <div className="flex items-center text-gray-500">
              <Linkedin className="mr-2 h-4 w-4" />
              {user.linkedin}
            </div>
            <div className="flex items-center text-gray-500">
              <Globe className="mr-2 h-4 w-4" />
              {user.website}
            </div>
            <div className="flex items-center text-gray-500">
              <Info className="mr-2 h-4 w-4" />
              {user.bio}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;