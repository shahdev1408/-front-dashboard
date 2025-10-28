'use client'

import { useState } from "react";
import { User, Bell, Shield, Monitor } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@learnhub.com",
    bio: "Learning platform administrator",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handleSaveNotifications = () => {
    alert("Notification preferences saved!");
  };

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-500">
          Manage your account preferences and system settings
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-6 text-gray-600">
        {[
          { key: "profile", icon: <User className="w-4 h-4" />, label: "Profile" },
          { key: "notifications", icon: <Bell className="w-4 h-4" />, label: "Notifications" },
          { key: "system", icon: <Monitor className="w-4 h-4" />, label: "System" },
          { key: "security", icon: <Shield className="w-4 h-4" />, label: "Security" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition
              ${activeTab === tab.key
                ? "border-blue-500 text-blue-600"
                : "border-transparent hover:text-blue-500"}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <section className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-linear-to-r from-cyan-500 to-blue-400 flex items-center justify-center text-white font-bold text-2xl">
                AU
              </div>
              <button
                type="button"
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Change Avatar
              </button>
            </div>

            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-linear-to-r from-cyan-500 to-blue-400 text-white hover:opacity-90"
            >
              Save Changes
            </button>
          </form>
        </section>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <section className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {[
            {
              key: "emailNotifications",
              label: "Email Notifications",
              desc: "Receive notifications via email",
            },
            {
              key: "pushNotifications",
              label: "Push Notifications",
              desc: "Receive push notifications in browser",
            },
            {
              key: "weeklyReport",
              label: "Weekly Report",
              desc: "Receive weekly analytics summary",
            },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{n.label}</h4>
                <p className="text-sm text-gray-500">{n.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications[n.key as keyof typeof notifications]}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [n.key]: e.target.checked,
                    })
                  }
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition" />
                <div className="absolute w-4 h-4 bg-white rounded-full left-0.5 top-0.5 peer-checked:translate-x-5 transition" />
              </label>
            </div>
          ))}

          <button
            onClick={handleSaveNotifications}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90"
          >
            Save Preferences
          </button>
        </section>
      )}

      {/* System Tab */}
      {activeTab === "system" && (
        <section className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div>
            <label className="font-medium">Platform Version</label>
            <p className="text-sm text-gray-500 mt-1">LearnHub v2.4.0</p>
          </div>

          <div>
            <label className="font-medium">Storage Usage</label>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-2 text-gray-600">
                <span>124.5 GB of 500 GB used</span>
                <span className="font-semibold">24.9%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  style={{ width: "24.9%" }}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="font-medium">Database Status</label>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          </div>
        </section>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <section className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div>
            <label className="block font-medium mb-1">Current Password</label>
            <input type="password" className="w-full border border-gray-300 rounded-md p-2" />
          </div>

          <div>
            <label className="block font-medium mb-1">New Password</label>
            <input type="password" className="w-full border border-gray-300 rounded-md p-2" />
          </div>

          <div>
            <label className="block font-medium mb-1">Confirm New Password</label>
            <input type="password" className="w-full border border-gray-300 rounded-md p-2" />
          </div>

          <button
            onClick={() => alert("Password updated successfully!")}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90"
          >
            Update Password
          </button>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-semibold mb-2">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500 mb-4">
              Add an extra layer of security to your account
            </p>
            <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
              Enable 2FA
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
