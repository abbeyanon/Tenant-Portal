import { useState } from "react";

export default function PushNotifications() {
  const [pushSettings, setPushSettings] = useState({
    enabled: true,
    loginAlerts: true,
    messageNotifications: true,
    systemNotifications: true,
    promotionalNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
  });

  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "Chrome on MacOS",
      browser: "Chrome",
      os: "macOS",
      enabled: true,
      addedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      name: "Safari on iPhone",
      browser: "Safari",
      os: "iOS",
      enabled: true,
      addedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [saved, setSaved] = useState(false);

  const toggleSetting = (key) => {
    setPushSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const toggleDevice = (deviceId) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, enabled: !device.enabled } : device
      )
    );
    setSaved(false);
  };

  const removeDevice = (deviceId) => {
    if (window.confirm("Remove this device from receiving push notifications?")) {
      setDevices((prev) => prev.filter((device) => device.id !== deviceId));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleSaveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const notificationSettings = [
    { key: "loginAlerts", label: "Login Alerts", description: "Get notified of login attempts" },
    { key: "messageNotifications", label: "Messages", description: "New messages and mentions" },
    { key: "systemNotifications", label: "System Updates", description: "Important system notifications" },
    { key: "promotionalNotifications", label: "Promotions", description: "Promotional and special offers" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Push Notifications</h3>

      <div className="space-y-6">
        {/* Master Toggle */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800">Enable Push Notifications</h4>
              <p className="text-xs text-gray-600">Receive notifications across your devices</p>
            </div>
            <input
              type="checkbox"
              checked={pushSettings.enabled}
              onChange={() => toggleSetting("enabled")}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
        </div>

        {pushSettings.enabled && (
          <>
            {/* Notification Types */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Notification Types
              </h4>
              <div className="space-y-3">
                {notificationSettings.map((setting) => (
                  <div key={setting.key} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md">
                    <input
                      type="checkbox"
                      id={setting.key}
                      checked={pushSettings[setting.key]}
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

            {/* Sound & Vibration */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Notification Behavior
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md">
                  <input
                    type="checkbox"
                    id="soundEnabled"
                    checked={pushSettings.soundEnabled}
                    onChange={() => toggleSetting("soundEnabled")}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="soundEnabled" className="cursor-pointer flex-1">
                    <p className="font-medium text-gray-800">Sound</p>
                    <p className="text-xs text-gray-500">Play sound with notifications</p>
                  </label>
                </div>

                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md">
                  <input
                    type="checkbox"
                    id="vibrationEnabled"
                    checked={pushSettings.vibrationEnabled}
                    onChange={() => toggleSetting("vibrationEnabled")}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="vibrationEnabled" className="cursor-pointer flex-1">
                    <p className="font-medium text-gray-800">Vibration</p>
                    <p className="text-xs text-gray-500">Vibrate on mobile devices</p>
                  </label>
                </div>
              </div>
            </div>

            {/* Registered Devices */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Your Devices ({devices.length})
              </h4>
              <div className="space-y-2">
                {devices.map((device) => (
                  <div key={device.id} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-800">{device.name}</p>
                        <p className="text-xs text-gray-500">
                          Added {device.addedDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={device.enabled}
                          onChange={() => toggleDevice(device.id)}
                          className="w-4 h-4"
                          title={device.enabled ? "Disable notifications" : "Enable notifications"}
                        />
                        <button
                          onClick={() => removeDevice(device.id)}
                          className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    {device.enabled && (
                      <p className="text-xs text-green-600 font-medium">✓ Notifications enabled</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

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
