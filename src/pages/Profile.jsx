import ProfileAvatar from "../settings/profile/ProfileAvatar.jsx";
import ProfileForm from "../settings/profile/ProfileForm.jsx";
import ProfileActions from "../settings/profile/ProfileActions.jsx";
export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <ProfileAvatar />

        <div className="mt-6">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
