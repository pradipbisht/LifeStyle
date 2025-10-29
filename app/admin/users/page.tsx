"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Users,
  UserCheck,
  UserX,
  TrendingUp,
} from "lucide-react";
import AdminLayout from "../AdminLayout";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  isVerified: boolean;
  profilePic?: string;
  timestamp: any;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleVerification = async (
    userId: string,
    currentStatus: boolean
  ) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        isVerified: !currentStatus,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error toggling verification:", error);
      alert("Failed to update verification status");
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "users", userId));
      alert("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const verifiedCount = users.filter((u) => u.isVerified).length;
  const unverifiedCount = users.filter((u) => !u.isVerified).length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const verificationRate =
    users.length > 0 ? Math.round((verifiedCount / users.length) * 100) : 0;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className={`${playfair.className} text-3xl font-bold text-gray-900`}>
              User Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage users, roles, and verification status
            </p>
          </div>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Bento Grid - Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <Card className="bg-linear-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-blue-700 font-medium">
                  Total Users
                </CardDescription>
                <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-900">
                {users.length}
              </div>
              <p className="text-xs text-blue-700 mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                All registered users
              </p>
            </CardContent>
          </Card>

          {/* Verified Users */}
          <Card className="bg-linear-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-green-700 font-medium">
                  Verified
                </CardDescription>
                <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-900">
                {verifiedCount}
              </div>
              <p className="text-xs text-green-700 mt-2">
                {verificationRate}% verification rate
              </p>
            </CardContent>
          </Card>

          {/* Unverified Users */}
          <Card className="bg-linear-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-orange-700 font-medium">
                  Unverified
                </CardDescription>
                <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center">
                  <UserX className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-900">
                {unverifiedCount}
              </div>
              <p className="text-xs text-orange-700 mt-2">
                Pending verification
              </p>
            </CardContent>
          </Card>

          {/* Admin Users */}
          <Card className="bg-linear-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-purple-700 font-medium">
                  Admins
                </CardDescription>
                <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-900">
                {adminCount}
              </div>
              <p className="text-xs text-purple-700 mt-2">Admin accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Complete list of registered users
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
                <span className="ml-3 text-gray-600">Loading users...</span>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-linear-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                              {user.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : "secondary"
                            }
                            className={
                              user.role === "admin"
                                ? "bg-purple-600"
                                : "bg-gray-200 text-gray-700"
                            }>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleToggleVerification(user.id, user.isVerified)
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
                            style={{
                              backgroundColor: user.isVerified
                                ? "#dcfce7"
                                : "#fed7aa",
                              color: user.isVerified ? "#166534" : "#9a3412",
                            }}>
                            {user.isVerified ? (
                              <>
                                <CheckCircle className="h-3.5 w-3.5" />
                                Verified
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3.5 w-3.5" />
                                Unverified
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div
                            className="inline-flex rounded-lg shadow-sm"
                            role="group">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(user)}
                              className="rounded-r-none border-r-0 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleDeleteUser(user.id, user.username)
                              }
                              className="rounded-l-none hover:bg-red-50 hover:text-red-700 hover:border-red-300">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CreateUserModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchUsers}
      />
      {selectedUser && (
        <EditUserModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSuccess={fetchUsers}
          user={selectedUser}
        />
      )}
    </AdminLayout>
  );
}
