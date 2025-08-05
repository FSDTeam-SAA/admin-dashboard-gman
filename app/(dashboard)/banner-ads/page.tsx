"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Define types for the ad data
interface Ad {
  _id: string;
  title: string;
  thumbnail: {
    url: string;
  };
  link: string;
  clicked: number;
  createdAt: string;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errorSources?: { path: string; message: string }[];
}

// Fetch ads using native fetch
const fetchAds = async (token: string | undefined): Promise<Ad[]> => {
  if (!token) throw new Error("No token found");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/get-ads`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch ads");
  }
  const data: ApiResponse<Ad[]> = await response.json();
  console.log(data);
  return data.data;
};

// Create ad using native fetch
const createAd = async (
  formData: FormData,
  token: string | undefined
): Promise<Ad> => {
  if (!token) throw new Error("No token found");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/banner-ads`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create ad");
  }
  const data: ApiResponse<Ad> = await response.json();
  return data.data;
};

// Update ad using native fetch
const updateAd = async ({
  id,
  formData,
  token,
}: {
  id: string;
  formData: FormData;
  token: string | undefined;
}): Promise<Ad> => {
  if (!token) throw new Error("No token found");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/banner-ads/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update ad");
  }
  const data: ApiResponse<Ad> = await response.json();
  return data.data;
};

// Delete ad using native fetch
const deleteAd = async (
  id: string,
  token: string | undefined
): Promise<void> => {
  if (!token) throw new Error("No token found");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/banner-ads/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage =
      errorData.errorSources?.[0]?.message ||
      errorData.message ||
      "Failed to delete ad";
    throw new Error(errorMessage);
  }
  const data: ApiResponse<void> = await response.json();
  return data.data;
};

export default function BannerAdsPage() {
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const {
    data: ads,
    isLoading,
    error,
    isError,
  } = useQuery<Ad[], Error>({
    queryKey: ["ads"],
    queryFn: () => fetchAds(session?.accessToken),
  });



  if (isError && error) {
    toast.error(error.message || "Failed to load ads");
  }

  const createMutation = useMutation({
    mutationFn: (formData: FormData) =>
      createAd(formData, session?.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      resetForm();
      setIsModalOpen(false);
      toast.success("Banner created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create banner");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateAd({ id, formData, token: session?.accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      resetForm();
      setIsModalOpen(false);
      toast.success("Banner updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update banner");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAd(id, session?.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      toast.success("Banner deleted successfully");
      setIsDeleteModalOpen(false);
      setAdToDelete(null);
    },
    onError: (error: Error) => {
      console.error("Delete mutation error:", error);
      toast.error(error.message || "Failed to delete banner");
      setIsDeleteModalOpen(false);
      setAdToDelete(null);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Only JPEG and PNG images are allowed");
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedImage && !editingAd) {
      toast.error("Please select an image to upload");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    if (!link.trim() || !urlPattern.test(link)) {
      toast.error("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    const formData = new FormData();
    if (selectedImage) {
      formData.append("banners", selectedImage);
    }
    formData.append("title", title);
    formData.append("link", link);

    if (editingAd) {
      updateMutation.mutate({ id: editingAd._id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad);
    setTitle(ad.title);
    setLink(ad.link);
    setPreviewUrl(ad.thumbnail.url);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (adToDelete) {
      deleteMutation.mutate(adToDelete);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setTitle("");
    setLink("");
    setEditingAd(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setAdToDelete(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Banner Ads Management
          </h1>
          <nav className="text-sm text-[#272727]">
            Dashboard {">"} Banner Ads
          </nav>
        </div>
        <button
          onClick={openModal}
          className="px-4 py-2 bg-[#039B06] text-white rounded hover:bg-[#039B06]/80 cursor-pointer"
        >
          Add New Banner
        </button>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 id="modal-title" className="text-lg font-semibold">
                {editingAd ? "Edit Banner Ad" : "Add New Banner Ad"}
              </h2>
              <button
                onClick={closeModal}
                className="text-[#272727] hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  placeholder="Enter banner title"
                />
              </div>
              <div>
                <label
                  htmlFor="link"
                  className="block text-sm font-medium text-gray-700"
                >
                  Link
                </label>
                <input
                  id="link"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  placeholder="Enter banner link (e.g., https://example.com)"
                />
              </div>
              <div>
                <label
                  htmlFor="banner-image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Banner Image
                </label>
                <input
                  id="banner-image"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-[#272727] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {previewUrl && (
                <div className="mt-4">
                  <Image
                    width={200}
                    height={200}
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-xs rounded"
                  />
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#039B06] text-white rounded hover:bg-[#039B06]/80 flex items-center cursor-pointer"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <>{editingAd ? "Update" : "Upload"} Banner</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 cursor-pointer"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-labelledby="delete-modal-title"
          aria-modal="true"
          onKeyDown={(e) => {
            if (e.key === "Escape") closeDeleteModal();
            if (e.key === "Enter") confirmDelete();
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 id="delete-modal-title" className="text-lg font-semibold mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete banner ad with ID {adToDelete}?
              This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                disabled={deleteMutation.isPending}
                aria-label="Confirm deletion of banner ad"
              >
                {deleteMutation.isPending ? "Confirm..." : "Confirm"}
              </button>
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 cursor-pointer"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="p-6 rounded-lg">
        {isLoading && (
          <div className="overflow-x-auto">
            <table
              className="min-w-full divide-y divide-gray-200"
              aria-busy="true"
            >
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-base font-medium text-[#272727]">
                    Thumbnail
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-[#272727]">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-[#272727]">
                    Link
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-[#272727]">
                    Clicked
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-[#272727]">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-[#272727]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[...Array(3)].map((_, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-24 h-16 bg-gray-200 animate-pulse rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <div className="h-6 w-6 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-6 w-6 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {Array.isArray(ads) && ads.length === 0 && (
          <div className="text-center py-4 text-[#272727]">
            No ads available
          </div>
        )}
        {Array.isArray(ads) && ads.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-base font-medium text-[#272727]">
                    Thumbnail
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-[#272727]">
                    Title
                  </th>

                  <th className="px-6 py-3 text-left text-base font-medium text-[#272727]">
                    Link
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-[#272727]">
                    Clicked
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-[#272727]">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-[#272727]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ads.map((ad) => (
                  <tr key={ad._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Image
                        src={ad.thumbnail.url}
                        alt="Banner"
                        width={300}
                        height={300}
                        className="w-24 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#272727]">
                      {ad.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#272727]">
                      <a
                        href={ad.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {ad.link}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#272727]">
                      {ad.clicked || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#272727]">
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(ad)}
                        className="cursor-pointer"
                        aria-label={`Edit banner ${ad.title}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(ad._id)}
                        className="ml-2 cursor-pointer"
                        aria-label={`Delete banner ${ad.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
