import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const UserProfileDialog = ({ user, open, onClose }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center">
            <Avatar className="w-12 h-12">
              {user.profile_picture ? (
                <img src={user.profile_picture} alt={user.username} />
              ) : (
                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">{user.username}</h2>
              <p className="text-gray-500">{user.role}</p>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-gray-500">{user.address}</p>
              <p className="text-gray-500">{user.bio}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default UserProfileDialog;