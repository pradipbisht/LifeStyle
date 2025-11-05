"use client";

import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { db } from "@/firebase";
import { useAuth } from "@/components/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Settings,
  Bell,
  Heart,
  ShoppingBag,
  Star,
  Edit3,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../user-dashboard/DashboardLayout";
import {
  User as UserType,
  Address,
  UserPreferences,
} from "@/app/types/user-dashboard";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  profilePic?: string;
  isVerified: boolean;
  timestamp: any;
  phone?: string;
  bio?: string;
  location?: string;
  dateOfBirth?: string;
  website?: string;
  preferences?: UserPreferences;
  addresses?: Address[];
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  wishlistItems: number;
  reviewsGiven: number;
  blogsCreated: number;
  joinedDate: Date;
}

export default function ProfilePage() {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    bio: "",
    location: "",
    dateOfBirth: "",
    website: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 1000 },
    notifications: { email: true, push: true, sms: false },
    interests: [],
  });

  // Fetch user profile and stats
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch user profile from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() } as UserProfile;
          setProfile(userData);

          // Set form data
          setFormData({
            username: userData.username || "",
            phone: userData.phone || "",
            bio: userData.bio || "",
            location: userData.location || "",
            dateOfBirth: userData.dateOfBirth || "",
            website: userData.website || "",
          });

          // Set preferences
          if (userData.preferences) {
            setPreferences(userData.preferences);
          }
        }

        // Fetch user statistics
        await fetchUserStats();
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Get orders count and total spent
      const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const orders = ordersSnapshot.docs.map((doc) => doc.data());

      const totalOrders = orders.length;
      const totalSpent = orders.reduce(
        (sum, order) => sum + (order.total || 0),
        0
      );

      // Get wishlist count
      const wishlistQuery = query(
        collection(db, "wishlist"),
        where("userId", "==", user.uid)
      );
      const wishlistSnapshot = await getDocs(wishlistQuery);
      const wishlistItems = wishlistSnapshot.size;

      // Get reviews count
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("userId", "==", user.uid)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewsGiven = reviewsSnapshot.size;

      // Get blogs count
      const blogsQuery = query(
        collection(db, "blogs"),
        where("authorId", "==", user.uid)
      );
      const blogsSnapshot = await getDocs(blogsQuery);
      const blogsCreated = blogsSnapshot.size;

      setUserStats({
        totalOrders,
        totalSpent,
        wishlistItems,
        reviewsGiven,
        blogsCreated,
        joinedDate: profile?.timestamp?.toDate() || new Date(),
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !profile) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Update Firestore document
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        ...formData,
        preferences,
        updatedAt: new Date(),
      });

      // Update Firebase Auth display name if username changed
      if (formData.username !== profile.username) {
        await updateProfile(user, {
          displayName: formData.username,
        });
      }

      setSuccess("Profile updated successfully!");
      setEditMode(false);

      // Refresh profile data
      const updatedDoc = await getDoc(userDocRef);
      if (updatedDoc.exists()) {
        setProfile({ id: updatedDoc.id, ...updatedDoc.data() } as UserProfile);
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);

      // More specific error messages
      if (error.code === "permission-denied") {
        setError("Permission denied. Please check Firestore security rules.");
      } else if (error.code === "unauthenticated") {
        setError("You must be logged in to update your profile.");
      } else if (error.code === "not-found") {
        setError("User profile not found.");
      } else {
        setError(
          `Failed to update profile: ${
            error.message || error.code || "Unknown error"
          }`
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("New passwords don't match");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(
        user.email!,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, passwordData.newPassword);

      setSuccess("Password updated successfully!");
      setPasswordMode(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Error updating password:", error);
      if (error.code === "auth/wrong-password") {
        setError("Current password is incorrect");
      } else {
        setError("Failed to update password");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout user={{ name: "Loading...", email: "", avatar: "" }}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout user={{ name: "User", email: "", avatar: "" }}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Profile not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      user={{
        name: profile.username,
        email: profile.email,
        avatar: profile.profilePic || "",
      }}>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>
          <Button
            onClick={() => setEditMode(!editMode)}
            variant={editMode ? "outline" : "default"}>
            {editMode ? (
              <X className="mr-2 h-4 w-4" />
            ) : (
              <Edit3 className="mr-2 h-4 w-4" />
            )}
            {editMode ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Info Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage
                      src={profile.profilePic}
                      alt={profile.username}
                    />
                    <AvatarFallback className="text-2xl">
                      {profile.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{profile.username}</CardTitle>
                  <div className="flex items-center justify-center gap-2">
                    <Badge
                      variant={profile.isVerified ? "default" : "secondary"}>
                      {profile.isVerified ? (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Verified
                        </>
                      ) : (
                        <>
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Pending
                        </>
                      )}
                    </Badge>
                    <Badge variant="outline">{profile.role}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userStats && (
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">
                          {userStats.totalOrders}
                        </p>
                        <p className="text-sm text-gray-600">Orders</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          ${userStats.totalSpent.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">Spent</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {userStats.wishlistItems}
                        </p>
                        <p className="text-sm text-gray-600">Wishlist</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {userStats.reviewsGiven}
                        </p>
                        <p className="text-sm text-gray-600">Reviews</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Profile Details */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        disabled={!editMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={profile.email}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        disabled={!editMode}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        disabled={!editMode}
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfBirth: e.target.value,
                          })
                        }
                        disabled={!editMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        disabled={!editMode}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      disabled={!editMode}
                      placeholder="Tell us about yourself..."
                      className="min-h-[100px]"
                    />
                  </div>

                  {editMode && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleUpdateProfile} disabled={saving}>
                        {saving ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Receive order updates and promotions via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={preferences.notifications.email}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: {
                          ...preferences.notifications,
                          email: checked,
                        },
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={preferences.notifications.push}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: {
                          ...preferences.notifications,
                          push: checked,
                        },
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Receive SMS updates for important orders
                    </p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={preferences.notifications.sms}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: {
                          ...preferences.notifications,
                          sms: checked,
                        },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!passwordMode ? (
                  <Button onClick={() => setPasswordMode(true)}>
                    Change Password
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdatePassword} disabled={saving}>
                        {saving ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent mr-2" />
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setPasswordMode(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Account Status</Label>
                    <p className="text-sm text-gray-600">
                      {profile.isVerified
                        ? "Your account is verified"
                        : "Account pending verification"}
                    </p>
                  </div>
                  <Badge variant={profile.isVerified ? "default" : "secondary"}>
                    {profile.isVerified ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Member Since</Label>
                    <p className="text-sm text-gray-600">
                      {userStats?.joinedDate.toLocaleDateString()}
                    </p>
                  </div>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
