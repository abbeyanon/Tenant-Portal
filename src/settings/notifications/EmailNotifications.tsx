import { useState } from "react";

export default function EmailNotifications() {
  const [emailSettings, setEmailSettings] = useState({
    securityAlerts: true,
    loginAttempts: true,
    passwordChanges: true,
    newDevices: true,
    accountActivity: true,
    marketingEmails: false,
    weeklyDigest: true,
    monthlyReport: false,
    productUpdates: false,
  });

  const [saved, setSaved] = useState(false);

  const toggleSetting = (key) => {
    setEmailSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const handleSaveSettings = () => {
    // Mock API call
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const securitySettings = [
    { key: "securityAlerts", label: "Security Alerts", description: "Alerts about suspicious activities" },
    { key: "loginAttempts", label: "Login Attempts", description: "Notifications for failed login attempts" },
    { key: "passwordChanges", label: "Password Changes", description: "Alerts when your password is changed" },
    { key: "newDevices", label: "New Devices", description: "Notifications when new devices login" },
    { key: "accountActivity", label: "Account Activity", description: "Summary of your account activities" },
  ];

  const marketingSettings = [
    { key: "marketingEmails", label: "Marketing Emails", description: "News and promotional offers" },
    { key: "weeklyDigest", label: "Weekly Digest", description: "Weekly summary of platform updates" },
    { key: "monthlyReport", label: "Monthly Report", description: "Monthly insights and analytics" },
    { key: "productUpdates", label: "Product Updates", description: "Information about new features" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Email Notifications</h3>

      <div className="space-y-6">
        {/* Security Alerts Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Security & Account
          </h4>
          <div className="space-y-3">
            {securitySettings.map((setting) => (
              <div key={setting.key} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md">
                <input
                  type="checkbox"
                  id={setting.key}
                  checked={emailSettings[setting.key]}
                  onChange={() => toggleSetting(setting.key)}
                  className="w-4 h-4 mt-1 cursor-pointer"
                />
                <label htmlFor={setting.key} className="flex-1 cursor-pointer">
                  <p className="font-medium text-gray-800">{setting.label}</p>
                  <p className="text-xs text-gray-500">{setting.description}</p>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing Section */}
        <div className="border-t pt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Marketing & Updates
          </h4>
          <div className="space-y-3">
            {marketingSettings.map((setting) => (
              <div key={setting.key} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md">
                <input
                  type="checkbox"
                  id={setting.key}
                  checked={emailSettings[setting.key]}
                  onChange={() => toggleSetting(setting.key)}
                  className="w-4 h-4 mt-1 cursor-pointer"
                />
                <label htmlFor={setting.key} className="flex-1 cursor-pointer">
                  <p className="font-medium text-gray-800">{setting.label}</p>
                  <p className="text-xs text-gray-500">{setting.description}</p>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t pt-4 flex gap-2">
          <button
            onClick={handleSaveSettings}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
          >
            Save Preferences
          </button>
          {saved && (
            <div className="flex-1 bg-green-100 text-green-800 py-2 rounded-md flex items-center justify-center font-medium">
              ✓ Saved
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
