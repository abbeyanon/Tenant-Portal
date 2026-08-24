import { useState } from "react";

export default function TwoFactorAuth() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 5; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  };

  const handleEnableTwoFactor = () => {
    setShowSetup(true);
    setBackupCodes(generateBackupCodes());
  };

  const handleVerifyTwoFactor = async () => {
    if (!verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    setError("");

    // Mock API call
    setTimeout(() => {
      setTwoFactorEnabled(true);
      setShowSetup(false);
      setVerificationCode("");
      setLoading(false);
    }, 1000);
  };

  const handleDisableTwoFactor = async () => {
    if (window.confirm("Are you sure you want to disable 2FA? This reduces your account security.")) {
      setLoading(true);
      setTimeout(() => {
        setTwoFactorEnabled(false);
        setBackupCodes([]);
        setLoading(false);
      }, 1000);
    }
  };

  const copyBackupCodes = () => {
    const text = backupCodes.join("\n");
    navigator.clipboard.writeText(text);
    alert("Backup codes copied to clipboard!");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Two-Factor Authentication (2FA)</h3>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            💡 Two-factor authentication adds an extra layer of security to your account. You'll need to enter a code from your authenticator app in addition to your password when logging in.
          </p>
        </div>

        {!twoFactorEnabled && !showSetup && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Status: <span className="text-red-600">Disabled</span></span>
            </div>
            <button
              onClick={handleEnableTwoFactor}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
            >
              Enable 2FA
            </button>
          </div>
        )}

        {showSetup && !twoFactorEnabled && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Step 1: Scan QR Code</h4>
              <div className="bg-white p-4 rounded-md border border-gray-300 inline-block mb-4">
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded">
                  <p className="text-gray-500 text-sm">QR Code</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Scan this QR code with your authenticator app (Google Authenticator, Microsoft Authenticator, Authy, etc.)
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">Step 2: Enter Verification Code</h4>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
              />
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">Step 3: Save Backup Codes</h4>
              <p className="text-sm text-gray-600 mb-3">
                Save these backup codes in a safe place. You can use them to access your account if you lose access to your authenticator app.
              </p>
              <div className="bg-white p-3 rounded-md border border-gray-300 mb-3">
                {backupCodes.map((code, idx) => (
                  <p key={idx} className="text-sm font-mono text-gray-700">
                    {code}
                  </p>
                ))}
              </div>
              <button
                onClick={copyBackupCodes}
                className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition text-sm font-medium mb-3"
              >
                Copy Backup Codes
              </button>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowSetup(false);
                  setVerificationCode("");
                  setError("");
                }}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyTwoFactor}
                disabled={loading || verificationCode.length !== 6}
                className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition font-medium"
              >
                {loading ? "Enabling..." : "Enable 2FA"}
              </button>
            </div>
          </div>
        )}

        {twoFactorEnabled && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Status: <span className="text-green-600">Enabled ✓</span></span>
            </div>
            <p className="text-sm text-gray-600">
              Your account is protected with two-factor authentication. You'll need to enter a code from your authenticator app when logging in.
            </p>
            <button
              onClick={handleDisableTwoFactor}
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 transition font-medium"
            >
              {loading ? "Disabling..." : "Disable 2FA"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
