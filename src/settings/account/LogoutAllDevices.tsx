import { useState } from "react";

export default function LogoutAllDevices() {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogoutAll = async () => {
    if (!confirmed) {
      alert("Please confirm that you want to logout from all devices");
      return;
    }

    if (!window.confirm(
      "Are you sure? You will be logged out from all devices and will need to login again."
    )) {
      return;
    }

    setLoading(true);

    // Mock API call
    setTimeout(() => {
      setSuccess(true);
      setConfirmed(false);
      setLoading(false);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Logout All Devices</h3>

      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            ⚠️ This will logout your account from all devices except the current one. You'll need to login again on each device.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-200">
          <input
            type="checkbox"
            id="confirmLogout"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="confirmLogout" className="text-sm text-gray-700">
            I understand and want to logout from all devices
          </label>
        </div>

        {success && (
          <div className="p-3 bg-green-100 border border-green-300 rounded-md">
            <p className="text-green-800 font-medium">✓ Successfully logged out from all devices!</p>
          </div>
        )}

        <button
          onClick={handleLogoutAll}
          disabled={loading || !confirmed}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 transition font-medium"
        >
          {loading ? "Logging out..." : "Logout All Devices"}
        </button>
      </div>
    </div>
  );
}
