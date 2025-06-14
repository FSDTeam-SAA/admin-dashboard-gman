"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Edit } from "lucide-react";
import ChangePasswordModal from "./_components/change-password-modal";
import { useSession } from "next-auth/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

interface CustomSession {
  accessToken?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  username?: string;
  phone: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  address?: Address;
  credit?: number | null;
  role: string;
  fine: number;
  uniqueId: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileUpdateData {
  name: string;
  username?: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState<ProfileUpdateData>({
    name: "",
    username: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { data: session } = useSession() as { data: CustomSession | null };
  const token = session?.accessToken;

  const queryClient = useQueryClient();

  // Fetch user profile
  type UserProfileQueryResponse = {
    success: boolean;
    message: string;
    data: UserProfile;
  };

  const { data: profile, isLoading } = useQuery<UserProfileQueryResponse>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No access token available");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      return response.json();
    },
    enabled: !!token,
  });

  // Update formData when profile is fetched successfully
  useEffect(() => {
    if (profile?.success) {
      setFormData({
        name: profile.data.name || "",
        username: profile.data.username || "",
        phone: profile.data.phone || "",
        address: {
          street: profile.data.address?.street || "",
          city: profile.data.address?.city || "",
          state: profile.data.address?.state || "",
          zipCode: profile.data.address?.zipCode || "",
        },
      });
    }
  }, [profile]);

  // Clean up avatar preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // Avatar upload mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!token) {
        throw new Error("No access token available");
      }
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update-profile`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to upload avatar");
      }
      return response.json() as Promise<{
        success: boolean;
        message: string;
        data: { avatar: { url: string; public_id: string } };
      }>;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        setAvatarPreview(null); // Clear preview after successful upload
      }
    },
    onError: () => {
      toast.error("Failed to upload avatar");
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      if (!token) {
        throw new Error("No access token available");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update-profile`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const handleInputChange = (field: keyof ProfileUpdateData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      // Revoke previous preview URL to prevent memory leaks
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
      // Set new preview and file
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
    if (avatarFile) {
      uploadAvatarMutation.mutate(avatarFile);
      setAvatarFile(null);
    }
  };

  const handleCancel = () => {
    if (profile?.success) {
      setFormData({
        name: profile.data.name || "",
        username: profile.data.username || "",
        phone: profile.data.phone || "",
        address: {
          street: profile.data.address?.street || "",
          city: profile.data.address?.city || "",
          state: profile.data.address?.state || "",
          zipCode: profile.data.address?.zipCode || "",
        },
      });
    }
    setAvatarFile(null);
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const userProfile = profile?.data;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Settings
          </h1>
          <p className="text-gray-600">Manage Dashboard Settings</p>
        </div>
        <Breadcrumb className="flex items-center space-x-1">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          &gt;
          <BreadcrumbItem>
            <BreadcrumbLink className="ml-1">
              Dashboard Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={
                    avatarPreview ||
                    userProfile?.avatar?.url ||
                    "/placeholder.svg?height=80&width=80"
                  }
                />
                <AvatarFallback className="text-2xl">
                  {userProfile?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {userProfile?.name || "User"}
                </h2>
                <p className="text-muted-foreground">
                  @{userProfile?.username || "username"}
                </p>
                {isEditing && (
                  <div className="mt-2">
                    <Label htmlFor="avatar">Upload Avatar</Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={uploadAvatarMutation.isPending}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </Button>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={
                      updateProfileMutation.isPending ||
                      uploadAvatarMutation.isPending
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={
                      updateProfileMutation.isPending ||
                      uploadAvatarMutation.isPending
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {updateProfileMutation.isPending ||
                    uploadAvatarMutation.isPending
                      ? "Saving..."
                      : "Save"}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              )}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username || ""}
                onChange={(e) => handleInputChange("username", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userProfile?.email || ""}
                disabled
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={formData.address?.street || ""}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your street address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.address?.city || ""}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.address?.state || ""}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your state"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                value={formData.address?.zipCode || ""}
                onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your zip code"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <ChangePasswordModal
        open={showChangePassword}
        onOpenChange={setShowChangePassword}
      />
    </div>
  );
}
