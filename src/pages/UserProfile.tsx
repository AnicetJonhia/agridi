import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {
  CloudDownload,
  Globe,
  Info,
  Linkedin,
  Mail,
  MapPin,
  Omega,
  Pencil,
  Phone,
  Pocket,
  UserRound,
  X
} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import useUserStore from "@/stores/userStore.ts";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useToast} from "@/hooks/use-toast.ts";
import {Toaster} from "@/components/ui/toaster.tsx";
import {Drawer, DrawerClose, DrawerContent} from "@/components/ui/drawer.tsx";
import { useSelector } from 'react-redux';
import { RootState } from '@/stores';

interface UserProfileProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({isOpen, onClose}) => {
  const { user, fetchUserProfile, updateUserProfile } = useUserStore();
   const token = useSelector((state: RootState) => state.auth.token);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();


  const roleMap = {
    Pro: "Productor",
    Col: "Collector",
    Con: "Consumer",
  };


  const [formData, setFormData] = useState({
    id:"",
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    bio: "",
    website: "",
    role: "",
    date_of_birth: "",
    alternate_email: "",
    linkedin: "",
    profile_picture: null as string | File | null,
  });

  // New state to track the currently selected file
  const [tempProfilePicture, setTempProfilePicture] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        fetchUserProfile(token);
      }
    };
    fetchProfile();

  }, [fetchUserProfile]);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });

    }
  }, [user]);



  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTempProfilePicture(e.target.files[0]); // Set the temporary file
    }
  };

  const handleFileSave = async () => {
    if (tempProfilePicture) {
      const updatedData = new FormData();
      updatedData.append('profile_picture', tempProfilePicture);

      try {
        if (token) {
          await updateUserProfile(token, updatedData);
        }
        setFormData({ ...formData, profile_picture: tempProfilePicture }); // Update the profile picture in formData
        setIsDialogOpen(false);
        toast({
          title: "Success",
          description: "Profile picture updated successfully.",
        });
      } catch (error) {
        console.error('Failed to update profile picture:', error);
        toast({
          title: "Error",
          description: "Failed to update profile picture. Please try again.",
        });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (tempProfilePicture) {
        URL.revokeObjectURL(URL.createObjectURL(tempProfilePicture));
      }
    };
  }, [tempProfilePicture]);

  const handleSave = async () => {
    if (formData.username && formData.email) {
      const updatedData = new FormData();
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof typeof formData];
        if (value !== null) {
          if (key === 'profile_picture' && value instanceof File) {
            updatedData.append(key, value);
          } else if (key !== 'profile_picture') {
            updatedData.append(key, value as string);
          }
        }
      });

      try {
        if (token) {
          await updateUserProfile(token, updatedData);
        }
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        });
      } catch (error) {
        console.error('Failed to update profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
        });
      }
    } else {
      console.error('Validation failed: Missing required fields');
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
    }
  };




  return (
      <Drawer open={isOpen} onOpenChange={onClose}>

        <DrawerContent
         className={`mx-auto my-auto  max-h-full rounded-lg shadow-lg ${
            isEditing ? "h-5/6" : "h-auto"
          }`}
        >
          <DrawerClose asChild>
                <Button variant={"outline"}
                  className="absolute top-2 right-2  h-8 w-8 rounded-full   "
                  aria-label="Close"
                >
                  ✕
                </Button>
              </DrawerClose>
          {!isEditing ? (
              <div
                  className="h-full overflow-y-auto px-6 py-4 space-y-6 space-x-4 flex md:flex-row flex-col items-center justify-center">
                <header
                    className="w-full flex flex-col  items-center md:flex-row md:items-center md:justify-end md:space-x-4 space-y-4 md:space-y-0">
                  <div>
                    <div className="flex items-center  space-x-4 mb-3" onClick={() => setIsDialogOpen(true)}>
                      {formData.profile_picture ? (
                          <img
                              src={formData.profile_picture instanceof File ? URL.createObjectURL(formData.profile_picture) : formData.profile_picture}
                              alt="you"
                              className=" scale-with-origin w-24 h-24 border rounded-full object-cover cursor-pointer"
                          />
                      ) : (
                          <UserRound className="w-24 h-24 border rounded-full"/>
                      )}
                      <div className="space-y-1.5">
                        <h1 className="popup-animation text-2xl font-bold">
                          {formData.username || "You"}
                        </h1>
                        <p className="text-muted-foreground">
                          {roleMap[formData.role] || formData.role}
                        </p>
                      </div>
                    </div>

                    <Button variant={"outline"} onClick={handleEditToggle} className=" bounce space-x-4 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110  duration-300">
                      <span>Edit Profile</span> <Pencil className={"w-4 "}/>
                    </Button>
                  </div>
                </header>

                <div
                    className="mt-6 p-4 bg-gradient-to-r from-muted  to-transparent rounded-lg space-y-2 w-full">


                {(formData.email || formData.alternate_email) && (
                    <div className="flex items-center text-gray-500 animate-scaleIn">
                      <Mail className="mr-2 h-4 w-4"/>
                      {formData.email} <span className={"mr-4 ml-4"}>|</span> {formData.alternate_email}
                    </div>
                )}
                {(formData.first_name || formData.last_name) && (
                    <div className="flex items-center text-gray-500 animate-scaleIn ">
                      <Omega className="mr-2 h-4 w-4"/>
                      {formData.first_name} {formData.last_name}
                    </div>
                )}
                {formData.address && (
                    <div className="flex items-center text-gray-500 animate-scaleIn">
                      <MapPin className="mr-2 h-4 w-4"/>
                      {formData.address}
                    </div>
                )}
                {formData.phone_number && (
                    <div className="flex items-center text-gray-500 animate-scaleIn">
                      <Phone className="mr-2 h-4 w-4"/>
                      {formData.phone_number}
                    </div>
                )}
                {formData.linkedin && (
                    <div className="flex items-center text-gray-500 animate-scaleIn">
                      <Linkedin className="mr-2 h-4 w-4"/>
                      {formData.linkedin}
                    </div>
                )}
                {formData.website && (
                    <div className="flex items-center text-gray-500 animate-scaleIn">
                      <Globe className="mr-2 h-4 w-4"/>
                      {formData.website}
                    </div>
                )}
                {formData.bio && (
                    <div className="flex items-center text-gray-500 animate-scaleIn">
                      <Info className="mr-2 h-4 w-4"/>
                      {formData.bio}
                    </div>
                )}
              </div>
            </div>

            ) : (
            <div className="h-full overflow-y-auto px-6 py-4 space-y-6">
            <header className="space-y-1.5">
                  <div className="flex items-center space-x-4" onClick={() => setIsDialogOpen(true)}>
                    {formData.profile_picture ? (
                        <img
                            src={formData.profile_picture instanceof File ? URL.createObjectURL(formData.profile_picture) : formData.profile_picture}
                            alt="you"
                            className="bounce w-24 h-24 border rounded-full object-cover cursor-pointer"
                        />
                    ) : (
                        <UserRound className="w-24 h-24 border rounded-full"/>
                    )}
                    <div className="space-y-1.5">
                      <h1 className="text-2xl font-bold popup-animation">
                        {formData.username || "You"}
                      </h1>
                      <p className="text-muted-foreground">
                        {roleMap[formData.role] || formData.role}
                      </p>
                    </div>
                  </div>

                </header>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6  ">
                      <div className={"animate-scaleIn"}>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}

                        />
                      </div>
                      <div className={"animate-scaleIn"}>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}

                        />
                      </div>
                      <div className={"animate-scaleIn"}>
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                            id="first_name"
                            type="text"
                            value={formData.first_name}
                            onChange={handleChange}

                        />
                      </div >
                      <div className={"animate-scaleIn"}>
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                            id="last_name"
                            type="text"
                            value={formData.last_name}
                            onChange={handleChange}

                    />
                  </div>
                  <div className={"animate-scaleIn"}>
                    <Label htmlFor="phone_number">Phone</Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={handleChange}

                    />
                  </div>
                  <div className={"animate-scaleIn"}>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}

                    />
                  </div>
                  <div className={"animate-scaleIn"}>
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}
                            >
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Select role"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pro">Producer</SelectItem>
                        <SelectItem value="Col">Collector</SelectItem>
                        <SelectItem value="Con">Consumer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={"animate-scaleIn"}>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}

                    />
                  </div>
                  <div className={"animate-scaleIn"}>
                    <Label htmlFor="alternate_email">Alternate Email</Label>
                    <Input
                      id="alternate_email"
                      type="email"
                      value={formData.alternate_email}
                      onChange={handleChange}

                    />
                  </div>
                  <div className={"animate-scaleIn"}>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      value={formData.linkedin}
                      onChange={handleChange}

                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 animate-scaleIn">
                <h2 className="text-lg font-semibold">Bio and Website</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      className="resize-none p-2 border rounded"
                      rows={3}
                      value={formData.bio}
                      onChange={handleChange}

                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="text"
                      value={formData.website}
                      onChange={handleChange}

                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-x-4">
              {isEditing && (
                <div className="flex justify-end items-center space-x-4">
                  <Button variant="destructive" onClick={handleEditToggle}>
                    <X/>
                  </Button>
                  <Button className={"btn"} onClick={handleSave}>
                    <span className="mr-2">Save</span>
                    <Pocket/>
                  </Button>
                </div>
              ) }
            </div>
          </div>
          )

          }


        </DrawerContent>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setTempProfilePicture(formData.profile_picture instanceof File ? formData.profile_picture : null);
          }
          setIsDialogOpen(open);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change your profile picture</DialogTitle>
            </DialogHeader>
            <img
              src={
                tempProfilePicture
                  ? URL.createObjectURL(tempProfilePicture)
                  : formData.profile_picture
              }
              alt="Profile"
              className="w-full h-full object-cover rounded-tl-lg rounded-tr-lg"
            />
            <div className="mt-4 flex flex-col items-start space-y-2">
              <Label
                htmlFor="profile_picture"
                className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground space-x-2"
              >
                <CloudDownload/>
                <span>Choose a new profile picture</span>
              </Label>
              <Input
                id="profile_picture"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                style={{display: 'none'}}
              />
            </div>
            <div className="flex w-full justify-end mt-4">
              {tempProfilePicture && (
                <Button onClick={handleFileSave} className="space-x-2"><span>Save</span> <Pocket/></Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Toaster/>
      </Drawer>
 );
};

export default UserProfile;