import React from "react";

const ProfileActions = ({ onSave, onCancel }) => {
  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={onSave}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Changes
      </button>
      <button
        onClick={onCancel}
        className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  );
};

export default ProfileActions;
