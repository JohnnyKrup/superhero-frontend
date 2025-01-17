import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { Shield, Users, Settings } from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [activeSection, setActiveSection] = useState("users");
  const [editingUser, setEditingUser] = useState(null);

  const navigation = [
    { name: "User Management", href: "#users", icon: Users, section: "users" },
    {
      name: "System Settings",
      href: "#settings",
      icon: Settings,
      section: "settings",
    },
    { name: "Access Control", href: "#roles", icon: Shield, section: "roles" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserUpdate = async (userId, userData) => {
    console.log("Updating user:", userId, userData);

    try {
      await axiosInstance.put(`/api/users/${userId}`, userData);
      setEditingUser(null);

      // Refresh user list
      const response = await axiosInstance.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleUserDelete = async (userId) => {
    try {
      await axiosInstance.delete(`/api/users/${userId}`);

      // Refresh user list after deletion
      const response = await axiosInstance.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
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
                    onClick={() => setActiveSection(item.section)}
                    className={`group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6 ${
                      activeSection === item.section
                        ? "bg-gray-50 text-indigo-600"
                        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon
                      className={`h-6 w-6 shrink-0 ${
                        activeSection === item.section
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
          {activeSection === "users" && (
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                User Management
              </h2>
              <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <li key={user.id}>
                      <div className="px-4 py-4 sm:px-6">
                        {editingUser?.id === user.id ? (
                          <div className="space-y-4">
                            <input
                              type="text"
                              value={editingUser.username}
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  username: e.target.value,
                                })
                              }
                              className="block w-full rounded-md border-gray-300 shadow-sm"
                            />
                            <input
                              type="email"
                              value={editingUser.email}
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  email: e.target.value,
                                })
                              }
                              className="block w-full rounded-md border-gray-300 shadow-sm"
                            />
                            <div className="flex gap-4">
                              <button
                                onClick={() =>
                                  handleUserUpdate(user.id, editingUser)
                                }
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingUser(null)}
                                className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="truncate text-sm font-medium text-indigo-600">
                                {user.username}
                              </p>
                              <p className="truncate text-sm text-gray-500">
                                {user.email}
                              </p>
                            </div>
                            <div className="flex gap-4">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you want to delete this user?"
                                    )
                                  ) {
                                    handleUserDelete(user.id);
                                  }
                                }}
                                className="rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeSection === "settings" && (
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                System Settings
              </h2>
              {/* Add system settings content */}
            </div>
          )}

          {activeSection === "roles" && (
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Access Control
              </h2>
              {/* Add role management content */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
