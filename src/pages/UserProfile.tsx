import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserRound } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useUser } from "@/context/UserContext";

const UserProfile: React.FC = () => {
  const { state, fetchUserProfile, updateUserProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (state.user && !isEditing) {
      setFormData({
        username: state.user.username || "",
        first_name: state.user.first_name || "",
        last_name: state.user.last_name || "",
        email: state.user.email || "",
        phone_number: state.user.phone_number || "",
        address: state.user.address || "",
        bio: state.user.bio || "",
        website: state.user.website || "",
        role: state.user.role || "",
        date_of_birth: state.user.date_of_birth || "",
        alternate_email: state.user.alternate_email || "",
        linkedin: state.user.linkedin || "",
      });
    }
  }, [state.user, isEditing]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSave = async () => {
    if (formData.username && formData.email) { // Add more validation as needed
      await updateUserProfile(formData);
      setIsEditing(false);
    } else {
      console.error('Validation failed: Missing required fields');
    }
  };

  return (
    <div>
      <div className="px-4 space-y-6 md:px-6">
        <header className="space-y-1.5">
          <div className="flex items-center space-x-4">
            {state.user?.profile_picture ? (
              <img
                src={state.user.profile_picture}
                alt="Profile Picture"
                className="w-24 h-24 border rounded-full object-cover"
              />
            ) : (
              <UserRound className="w-24 h-24 border rounded-full" />
            )}
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold">
                {formData.username || "You"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {formData.role}
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="phone_number">Phone</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })} disabled={!isEditing}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pro">Producer</SelectItem>
                    <SelectItem value="Col">Collector</SelectItem>
                    <SelectItem value="Con">Consumer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="alternate_email">Alternate Email</Label>
                <Input
                  id="alternate_email"
                  type="email"
                  value={formData.alternate_email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
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
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="text"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-x-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleEditToggle}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </>
          ) : (
            <Button size="lg" onClick={handleEditToggle}>
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;