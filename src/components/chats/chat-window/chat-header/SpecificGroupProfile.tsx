import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Users } from "lucide-react";

const SpecificGroupProfile = ({ group, open, onClose }) => {
  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className="mt-4 border rounded-lg">
          <div className="flex p-4 flex-col items-center md:flex-row md:items-start">
            {group.photo ? (
              <Avatar className="w-32 h-32 rounded-full">
                <img
                  src={
                    group.photo instanceof File
                      ? URL.createObjectURL(group.photo)
                      : group.photo
                  }
                  alt={group.name}
                />
              </Avatar>
            ) : (
              <Avatar className="w-32 h-32">
                <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div className="mt-4 md:ml-4 flex flex-col items-center md:items-start">
              <h2 className="text-lg font-semibold">{group.name}</h2>
              <div className="flex items-center text-gray-500">
                <Users className="mr-2 h-4 w-4" />
                {group.members.length} members
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-bl-lg rounded-br-lg border-t space-y-2">
            {group.address && (
              <div className="flex items-center text-gray-500">
                <MapPin className="mr-2 h-4 w-4" />
                {group.address}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpecificGroupProfile;