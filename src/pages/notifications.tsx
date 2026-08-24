'use client';

import { useState } from "react";
import EmailNotifications from "../settings/notifications/EmailNotifications";
import PushNotifications from "../settings/notifications/PushNotifications";
import InAppNotifications from "../settings/notifications/InAppNotifications";

export default function NotificationsPage() {
  const [activeSection, setActiveSection] = useState("email");

  const sections = [
    { id: "email", label: "Email", icon: "✉️" },
    { id: "push", label: "Push Notifications", icon: "🔔" },
    { id: "inapp", label: "In-App", icon: "💬" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with back link */}
      <div className="mb-8">
        <a href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Home
        </a>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Settings</h1>
        <p className="text-gray-600">Manage how you receive updates and alerts</p>
      </div>

      {/* Desktop Navigation - Sidebar */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="col-span-1">
          <nav className="space-y-1 sticky top-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeSection === section.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="col-span-3">
          {activeSection === "email" && <EmailNotifications />}
          {activeSection === "push" && <PushNotifications />}
          {activeSection === "inapp" && <InAppNotifications />}
        </div>
      </div>

      {/* Mobile Navigation - Tabs */}
      <div className="lg:hidden">
        <div className="overflow-x-auto mb-6 -mx-6 px-6">
          <div className="flex gap-2 pb-2 min-w-max">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                <span>{section.icon}</span>
                <span className="text-xs sm:text-sm font-medium">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Content */}
        <div className="space-y-6">
          {activeSection === "email" && <EmailNotifications />}
          {activeSection === "push" && <PushNotifications />}
          {activeSection === "inapp" && <InAppNotifications />}
        </div>
      </div>
    </div>
  );
}
