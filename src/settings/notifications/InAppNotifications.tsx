import { useState, useEffect } from "react";

export default function InAppNotifications() {
  const [inAppSettings, setInAppSettings] = useState({
    enabled: true,
    messages: true,
    mentions: true,
    updates: true,
    reminders: true,
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "message",
      title: "New Message",
      message: "You received a message from John Doe",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      icon: "💬",
    },
    {
      id: 2,
      type: "mention",
      title: "You were mentioned",
      message: "Jane mentioned you in a comment",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      icon: "@️",
    },
    {
      id: 3,
      type: "update",
      title: "System Update",
      message: "New features have been released",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      icon: "✨",
    },
    {
      id: 4,
      type: "reminder",
      title: "Reminder",
      message: "Your subscription expires in 7 days",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      icon: "⏰",
    },
  ]);

  const [saved, setSaved] = useState(false);

  const toggleSetting = (key) => {
    setInAppSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const clearAll = () => {
    if (window.confirm("Clear all notifications?")) {
      setNotifications([]);
    }
  };

  const handleSaveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  };

  const notificationSettings = [
    { key: "messages", label: "Messages", description: "Direct messages and conversations" },
    { key: "mentions", label: "Mentions", description: "When you're mentioned or tagged" },
    { key: "updates", label: "Updates", description: "System and feature updates" },
    { key: "reminders", label: "Reminders", description: "Scheduled reminders and alerts" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">In-App Notifications</h3>

      <div className="space-y-6">
        {/* Master Toggle */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800">Enable In-App Notifications</h4>
              <p className="text-xs text-gray-600">Show notifications while using the app</p>
            </div>
            <input
              type="checkbox"
              checked={inAppSettings.enabled}
              onChange={() => toggleSetting("enabled")}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
        </div>

        {inAppSettings.enabled && (
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
                      checked={inAppSettings[setting.key]}
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

            {/* Notification History */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Notification History
                  {unreadCount > 0 && (
                    <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h4>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-3 rounded-md border transition-all cursor-pointer ${
                        notif.read
                          ? "bg-white border-gray-200 opacity-75"
                          : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{notif.icon}</span>
                            <h5 className="font-medium text-gray-800">{notif.title}</h5>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{formatTime(notif.timestamp)}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="text-xs text-gray-400 hover:text-red-600 transition"
                          title="Delete notification"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
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
