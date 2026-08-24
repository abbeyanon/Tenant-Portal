import { useState } from "react";

export default function ProfileForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  function update(key, value) {
    setForm({ ...form, [key]: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving profile:", form);
    alert("Profile saved!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="font-medium">Full Name</label>
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full p-3 rounded border"
          placeholder="Enter full name"
        />
      </div>

      <div>
        <label className="font-medium">Phone Number</label>
        <input
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="w-full p-3 rounded border"
          placeholder="07xx xxx xxx"
        />
      </div>

      <div>
        <label className="font-medium">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="w-full p-3 rounded border"
          placeholder="Email"
        />
      </div>

      <div>
        <label className="font-medium">Address</label>
        <textarea
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          className="w-full p-3 rounded border"
          placeholder="Apartment, House, etc."
        />
      </div>

      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
        Save Changes
      </button>
    </form>
  );
}
