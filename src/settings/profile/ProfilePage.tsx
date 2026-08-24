
import React, { useState, useEffect } from "react";
import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import ProfileActions from "./ProfileActions";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Mock fetch data
  useEffect(() => {
    // Replace with actual API call
    const fetchProfile = async () => {
      const data = {
        firstName: "Abigael",
        lastName: "Lemba",
        email: "abigael@example.com",
        phone: "0712345678",
        profilePhotoUrl: null,
      };
      setProfileData(data);
      setProfilePhoto(data.profilePhotoUrl);
    };
    fetchProfile();
  }, []);

  const handleSave = () => {
    // Replace with API POST
    console.log("Saving profile", profileData, profilePhoto);
    alert("Profile saved successfully!");
  };

  const handleCancel = () => {
    // Optionally reset form
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>
      <ProfileAvatar currentPhoto={profilePhoto} onPhotoChange={setProfilePhoto} />
      <ProfileForm initialData={profileData} onSubmit={setProfileData} />
      <ProfileActions onSave={handleSave} onCancel={handleCancel} />
      <h1 className="text-4xl font-bold text-blue-500">Tailwind Works!</h1>
    </div>
  );
};

export default ProfilePage;
