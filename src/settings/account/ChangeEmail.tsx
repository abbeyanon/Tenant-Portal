import { useState } from "react";

export default function ChangeEmail() {
  const [currentEmail, setCurrentEmail] = useState("abigael@example.com");
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState("email"); // "email" | "verify" | "success"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendVerification = async () => {
    if (!newEmail) {
      setError("Please enter a new email address");
      return;
    }
    if (newEmail === currentEmail) {
      setError("New email must be different from current email");
      return;
    }

    setLoading(true);
    setError("");
    
    // Mock API call
    setTimeout(() => {
      setStep("verify");
      setLoading(false);
    }, 1000);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    setError("");
    
    // Mock API call
    setTimeout(() => {
      setCurrentEmail(newEmail);
      setStep("success");
      setLoading(false);
      setTimeout(() => {
        setStep("email");
        setNewEmail("");
        setVerificationCode("");
      }, 2000);
    }, 1000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Change Email</h3>

      {step === "email" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Email
            </label>
            <input
              type="email"
              value={currentEmail}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Email
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={handleSendVerification}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </div>
      )}

      {step === "verify" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            We've sent a verification code to <strong>{newEmail}</strong>
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-2">
            <button
              onClick={() => {
                setStep("email");
                setVerificationCode("");
              }}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Back
            </button>
            <button
              onClick={handleVerifyCode}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="p-4 bg-green-100 border border-green-300 rounded-md">
          <p className="text-green-800 font-medium">✓ Email changed successfully!</p>
          <p className="text-green-700 text-sm mt-1">Your new email is now {newEmail}</p>
        </div>
      )}
    </div>
  );
}
