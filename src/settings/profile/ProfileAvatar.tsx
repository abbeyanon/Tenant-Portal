import { useState } from "react";

export default function ProfileAvatar() {
  const [preview, setPreview] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <img
          src={preview || "https://via.placeholder.com/120"}
          className="w-32 h-32 rounded-full object-cover border"
        />

        <label className="absolute bottom-1 right-1 bg-blue-600 text-white px-2 py-1 rounded text-xs cursor-pointer">
          Change
          <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
        </label>
      </div>
    </div>
  );
}
