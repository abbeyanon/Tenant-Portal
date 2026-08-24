import { useState } from "react";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = (strength) => {
    if (strength === 0) return { label: "Too weak", color: "bg-red-500" };
    if (strength <= 2) return { label: "Weak", color: "bg-orange-500" };
    if (strength <= 3) return { label: "Good", color: "bg-yellow-500" };
    return { label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = calculatePasswordStrength(newPassword);
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  const handleChangePassword = async () => {
    setError("");
    setSuccess(false);

    if (!currentPassword) {
      setError("Please enter your current password");
      return;
    }
    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from current password");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    // Mock API call
    setTimeout(() => {
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Change Password</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {newPassword && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strengthInfo.color} transition-all`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">{strengthInfo.label}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ✓ At least 8 characters {newPassword.length >= 8 ? "✓" : "✗"}
                <br />
                ✓ Mix of uppercase and lowercase {/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? "✓" : "✗"}
                <br />
                ✓ Numbers {/\d/.test(newPassword) ? "✓" : "✗"}
                <br />
                ✓ Special characters {/[^a-zA-Z\d]/.test(newPassword) ? "✓" : "✗"}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type={showPasswords ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showPasswords"
            checked={showPasswords}
            onChange={(e) => setShowPasswords(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="showPasswords" className="text-sm text-gray-600">
            Show passwords
          </label>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && (
          <div className="p-3 bg-green-100 border border-green-300 rounded-md">
            <p className="text-green-800 font-medium">✓ Password changed successfully!</p>
          </div>
        )}

        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </div>
    </div>
  );
}
