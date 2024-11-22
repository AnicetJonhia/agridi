import {Dialog, DialogContent} from "@/components/ui/dialog";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {ChevronRight, ScanSearch, UserRoundPlus, Users} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Separator} from "@/components/ui/separator.tsx";
import {leaveGroup} from "@/services/chats-api.tsx";

const SpecificGroupProfile = ({ group, open, onClose }) => {
  if (!group) return null;

  const handleLeaveGroup = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await leaveGroup( group.id, token);
      onClose();
    } catch (error) {
      console.error('Failed to leave group:', error);
    }
  }
  return (
    <>
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
              {group.members && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center text-gray-500 cursor-pointer">
                      <ScanSearch className="mr-2 h-4 w-4" />
                      View all members
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent >
                   <DropdownMenuItem className="flex space-x-2 justify-between items-center">
                    <span>{group.name} members</span>
                      <Button variant={"outline"}>
                          <UserRoundPlus className="popup-animation" />

                      </Button>
                   </DropdownMenuItem>

                    <Separator/>
                    {group.members.map((member, index) => (
                      <DropdownMenuItem className={"mt-2"} key={index}>
                        <div className="flex items-center">
                          <Avatar className="w-8 h-8 mr-2">
                            {member.profile_picture ? (
                              <img
                                src={
                                  member.profile_picture instanceof File
                                    ? URL.createObjectURL(member.profile_picture)
                                    : member.profile_picture
                                }
                                alt={member.username}
                              />
                            ) : (
                              <AvatarFallback>{member.username.charAt(0)}</AvatarFallback>
                            )}
                          </Avatar>
                          <div className={"flex flex-col space-y-2"}>
                            <span>{member.username}</span>
                            <span className={"text-muted-foreground text-sm"}>{member.email}</span>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}


                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button variant={"destructive"} onClick={handleLeaveGroup}>
                <span>Leave group</span><ChevronRight className={"ml-2 w-4"} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpecificGroupProfile;