import { useState, useEffect } from "react";

export default function LoginActivity() {
  const [loginSessions, setLoginSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call to fetch login activity
    setTimeout(() => {
      const mockSessions = [
        {
          id: 1,
          device: "Chrome on MacOS",
          location: "Nairobi, Kenya",
          ipAddress: "197.136.45.123",
          lastActive: new Date(Date.now() - 2 * 60 * 1000), // 2 mins ago
          isCurrent: true,
        },
        {
          id: 2,
          device: "Safari on iPhone",
          location: "Nairobi, Kenya",
          ipAddress: "197.136.45.124",
          lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          isCurrent: false,
        },
        {
          id: 3,
          device: "Firefox on Windows",
          location: "Kampala, Uganda",
          ipAddress: "102.45.12.78",
          lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          isCurrent: false,
        },
        {
          id: 4,
          device: "Chrome on Linux",
          location: "Accra, Ghana",
          ipAddress: "102.89.34.56",
          lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          isCurrent: false,
        },
      ];
      setLoginSessions(mockSessions);
      setLoading(false);
    }, 1000);
  }, []);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  const handleRevokeSession = (sessionId) => {
    if (window.confirm("Are you sure you want to logout this device?")) {
      setLoginSessions(loginSessions.filter((session) => session.id !== sessionId));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Login Activity</h3>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {loginSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No active sessions</p>
          ) : (
            loginSessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-md border ${
                  session.isCurrent
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-800">
                      {session.device}
                      {session.isCurrent && (
                        <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{session.location}</p>
                  </div>
                  {!session.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(session.id)}
                      className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition"
                    >
                      Logout
                    </button>
                  )}
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>IP Address: {session.ipAddress}</p>
                  <p>Last Active: {formatTime(session.lastActive)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {loginSessions.length > 0 && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          Showing {loginSessions.length} active session{loginSessions.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
