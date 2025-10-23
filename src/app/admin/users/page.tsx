"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

type User = {
  id: number;
  email: string;
  full_name: string | null;
  role: string;
  is_verified: boolean;
  is_locked: boolean;
  two_factor_enabled: boolean;
  created_at?: string; // Optional since User model doesn't have this field
};

export default function UsersManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    role: "user",
    is_verified: false,
    is_locked: false,
    password: "",
  });

  useEffect(() => {
    if (status === "loading") return;
    const role = (session?.user as any)?.role;
    if (status === "unauthenticated" || role !== "admin") {
      router.replace("/login?next=/admin/users");
      return;
    }

    if (!(session as any)?.accessToken) {
      return;
    }

    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page, search, roleFilter]); // Removed 'session' from dependencies to prevent infinite loop

  const loadUsers = async () => {
    setLoading(true);
    try {
      const accessToken = (session as any)?.accessToken;
      if (!accessToken) {
        console.warn("Admin users page: missing access token, skipping fetch");
        setMessage({
          type: "error",
          text: "Authentication issue. Please log in again.",
        });
        setUsers([]);
        setLoading(false);
        return;
      }

      let url = `http://localhost:8000/api/v1/admin/users?page=${page}&page_size=20`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (roleFilter) url += `&role=${roleFilter}`;

      const response = await fetchWithAuth(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.items);
        setTotal(data.total);
        setTotalPages(data.total_pages);
        setMessage(null);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ detail: "Unknown error" }));
        console.error("API Error:", response.status, errorData);
        setMessage({
          type: "error",
          text: `Failed to load users: ${
            errorData.detail || response.statusText
          }`,
        });
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      setMessage({
        type: "error",
        text: "Failed to load users. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const accessToken = (session as any)?.accessToken;
      if (!accessToken) {
        setMessage({
          type: "error",
          text: "Authentication issue. Please log in again.",
        });
        return;
      }

      const response = await fetchWithAuth(
        "http://localhost:8000/api/v1/admin/users",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setMessage({ type: "success", text: "User created successfully!" });
        setShowModal(false);
        resetForm();
        loadUsers();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.detail || "Failed to create user",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to create user",
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const accessToken = (session as any)?.accessToken;
      if (!accessToken) {
        setMessage({
          type: "error",
          text: "Authentication issue. Please log in again.",
        });
        return;
      }

      const updateData: any = {
        email: formData.email,
        full_name: formData.full_name || null,
        role: formData.role,
        is_verified: formData.is_verified,
        is_locked: formData.is_locked,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetchWithAuth(
        `http://localhost:8000/api/v1/admin/users/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        setMessage({ type: "success", text: "User updated successfully!" });
        setShowModal(false);
        setEditingUser(null);
        resetForm();
        loadUsers();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.detail || "Failed to update user",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update user",
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const accessToken = (session as any)?.accessToken;
      if (!accessToken) {
        setMessage({
          type: "error",
          text: "Authentication issue. Please log in again.",
        });
        return;
      }

      const response = await fetchWithAuth(
        `http://localhost:8000/api/v1/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setMessage({ type: "success", text: "User deleted successfully!" });
        loadUsers();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.detail || "Failed to delete user",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to delete user",
      });
    }
  };

  const openCreateModal = () => {
    resetForm();
    setEditingUser(null);
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setFormData({
      email: user.email,
      full_name: user.full_name || "",
      role: user.role,
      is_verified: user.is_verified,
      is_locked: user.is_locked,
      password: "",
    });
    setEditingUser(user);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      full_name: "",
      role: "user",
      is_verified: false,
      is_locked: false,
      password: "",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bebas text-navy mb-2">
            User Management
          </h1>
          <p className="text-gray-600 font-lato">
            Manage user accounts and permissions
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <p className="font-montserrat">{message.text}</p>
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3 flex-1">
              <input
                type="text"
                placeholder="Search by email or name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-lato"
              />
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg font-lato"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange/90 font-montserrat font-semibold"
            >
              ➕ Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="p-4 text-left font-montserrat">Email</th>
                  <th className="p-4 text-left font-montserrat">Name</th>
                  <th className="p-4 text-left font-montserrat">Role</th>
                  <th className="p-4 text-left font-montserrat">Status</th>
                  <th className="p-4 text-left font-montserrat">2FA</th>
                  <th className="p-4 text-left font-montserrat">Created</th>
                  <th className="p-4 text-left font-montserrat">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="p-4 font-lato">{user.email}</td>
                    <td className="p-4 font-lato">{user.full_name || "-"}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-montserrat ${
                          user.role === "admin"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-montserrat ${
                            user.is_verified
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {user.is_verified ? "Verified" : "Unverified"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-montserrat ${
                            !user.is_locked
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {!user.is_locked ? "Active" : "Locked"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-lato">
                      {user.two_factor_enabled ? "✅" : "❌"}
                    </td>
                    <td className="p-4 font-lato text-sm">
                      {user.created_at 
                        ? new Date(user.created_at).toLocaleDateString() 
                        : "N/A"}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="px-3 py-1 bg-navy text-white rounded hover:bg-navy/90 text-sm font-montserrat"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-montserrat"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-montserrat"
            >
              Previous
            </button>
            <span className="px-4 py-2 font-montserrat">
              Page {page} of {totalPages} ({total} users)
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-montserrat"
            >
              Next
            </button>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-2xl font-bebas text-navy mb-4">
                {editingUser ? "Edit User" : "Create New User"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-lato"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-lato"
                  />
                </div>

                <div>
                  <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                    Password {editingUser && "(leave blank to keep current)"}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-lato"
                    placeholder={
                      editingUser ? "Leave blank to keep current" : ""
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-lato"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_verified}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_verified: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-orange focus:ring-orange border-gray-300 rounded mr-2"
                    />
                    <span className="font-montserrat text-navy">Verified</span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_locked}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_locked: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-orange focus:ring-orange border-gray-300 rounded mr-2"
                    />
                    <span className="font-montserrat text-navy">Locked</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-montserrat"
                >
                  Cancel
                </button>
                <button
                  onClick={editingUser ? handleUpdateUser : handleCreateUser}
                  className="flex-1 px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange/90 font-montserrat font-semibold"
                >
                  {editingUser ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
