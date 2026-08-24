import React from "react";

const Settings = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">

        {/* Account Settings */}
        <div>
          <h2 className="text-lg font-medium mb-3">Account Settings</h2>
          <div className="space-y-2">
            <p className="text-gray-700">Update your account details, such as email or phone.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Manage Account
            </button>
          </div>
        </div>

        <hr />

        {/* Security */}
        <div>
          <h2 className="text-lg font-medium mb-3">Security</h2>
          <div className="space-y-2">
            <p className="text-gray-700">Change password or enable security features.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Security Settings
            </button>
          </div>
        </div>

        <hr />

        {/* Notifications */}
        <div>
          <h2 className="text-lg font-medium mb-3">Notifications</h2>
          <div className="space-y-2">
            <p className="text-gray-700">Manage email and SMS notifications.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Notification Preferences
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
