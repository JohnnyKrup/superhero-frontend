import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../api/axios";
import { UserCircleIcon, TrophyIcon, Swords, Settings } from "lucide-react";

const navigation = [
  { name: "Account", href: "#account", icon: UserCircleIcon, current: true },
  { name: "Battle Stats", href: "#stats", icon: Swords, current: false },
  {
    name: "Achievements",
    href: "#achievements",
    icon: TrophyIcon,
    current: false,
  },
  { name: "Settings", href: "#settings", icon: Settings, current: false },
];

const Profile = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("account");
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleEdit = (field) => {
    setEditField(field);
    setError("");
  };

  const handleCancel = () => {
    setEditField(null);
    setFormData({
      ...formData,
      username: user?.username || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
  };

  const handleSave = async () => {
    try {
      const endpoint =
        editField === "password" ? "/api/users/password" : "/api/users/profile";

      const updateData =
        editField === "password"
          ? {
              currentPassword: formData.currentPassword,
              newPassword: formData.newPassword,
            }
          : { [editField]: formData[editField] };

      await axiosInstance.put(endpoint, updateData);
      setEditField(null);
      // You might want to refresh the user data here
    } catch (error) {
      setError(error.response?.data?.message || "Update failed");
    }
  };

  const renderEditableField = (label, field, type = "text") => {
    const isEditing = editField === field;
    const isPassword = field === "password";

    if (!isEditing) {
      return (
        <div className="pt-6 sm:flex">
          <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
            {label}
          </dt>
          <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
            <div className="text-gray-900">
              {isPassword ? "••••••••" : formData[field]}
            </div>
            <button
              onClick={() => handleEdit(field)}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Update
            </button>
          </dd>
        </div>
      );
    }

    return (
      <div className="pt-6">
        <dt className="font-medium text-gray-900 mb-2">{label}</dt>
        <dd className="space-y-4">
          {isPassword ? (
            <>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                placeholder="Current Password"
                className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2"
              />
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                placeholder="New Password"
                className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2"
              />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Confirm New Password"
                className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2"
              />
            </>
          ) : (
            <input
              type={type}
              value={formData[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2"
            />
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </dd>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
        {/* Sidebar */}
        <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
          <nav className="flex-none px-4 sm:px-6 lg:px-0">
            <ul
              role="list"
              className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
            >
              {navigation.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => setActiveSection(item.href.replace("#", ""))}
                    className={`group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6 ${
                      activeSection === item.href.replace("#", "")
                        ? "bg-gray-50 text-indigo-600"
                        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon
                      className={`h-6 w-6 shrink-0 ${
                        activeSection === item.href.replace("#", "")
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-indigo-600"
                      }`}
                    />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            {activeSection === "account" && (
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Profile
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Manage your account settings and preferences.
                </p>

                <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm">
                  {renderEditableField("Username", "username")}
                  {renderEditableField("Email", "email", "email")}
                  {renderEditableField("Password", "password")}
                </dl>
              </div>
            )}

            {activeSection === "stats" && (
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Battle Statistics
                </h2>
                <div className="mt-6">
                  <p>Battle statistics coming soon...</p>
                </div>
              </div>
            )}

            {activeSection === "achievements" && (
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Achievements
                </h2>
                <div className="mt-6">
                  <p>Achievements coming soon...</p>
                </div>
              </div>
            )}

            {activeSection === "settings" && (
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Settings
                </h2>
                <div className="mt-6">
                  <p>Settings coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
