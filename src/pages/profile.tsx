'use client';

import { useState } from "react";
import ProfileAvatar from "../settings/profile/ProfileAvatar";
import ProfileForm from "../settings/profile/ProfileForm";
import ProfileActions from "../settings/profile/ProfileActions";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    firstName: "Abigael",
    lastName: "Lemba",
    email: "abigael@example.com",
    phone: "0712345678",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleSave = () => {
    console.log("Saving profile", profileData, profilePhoto);
    alert("Profile saved successfully!");
  };

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header with back link */}
      <div className="mb-8">
        <a href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Home
        </a>
        <h1 className="text-3xl font-semibold mb-2">Profile Settings</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <ProfileAvatar />

        <div className="mt-6">
          <ProfileForm />
        </div>

        <div className="mt-6">
          <ProfileActions onSave={handleSave} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}
