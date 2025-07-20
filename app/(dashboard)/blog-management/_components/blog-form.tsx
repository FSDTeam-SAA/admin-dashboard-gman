"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Save } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { RichTextEditor } from "./rich-text-editor";
import { toast } from "sonner";

interface Blog {
  _id: string;
  blogName: string;
  description: string;
  thumbnail?: {
    url: string;
    public_id: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface BlogFormProps {
  blog?: Blog | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function BlogForm({ blog, onClose, onSuccess }: BlogFormProps) {
  const [title, setTitle] = useState(blog?.blogName || "");
  const [description, setDescription] = useState(blog?.description || "");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(blog?.thumbnail?.url || "");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const session = useSession();
  const token = (session?.data as { accessToken?: string })?.accessToken;

  useEffect(() => {
    if (!blog) {
      console.log("Blog prop is null or undefined");
    } else if (!blog.thumbnail) {
      console.log("Blog thumbnail is null or undefined", blog);
    }
  }, [blog]);

  const saveBlogMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const url = blog
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs/${blog._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs`;

      const response = await fetch(url, {
        method: blog ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save blog");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success(
        blog ? "Blog updated successfully!" : "Blog created successfully!"
      );
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error("Failed to save blog", {
        description: error.message,
      });
    },
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please select an image smaller than 10MB",
          action: {
            label: "OK",
            onClick: () => {},
          },
        });
        return;
      }
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      toast.success("Thumbnail selected");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Content is required");
      return;
    }

    const toastId = toast.loading(
      blog ? "Updating blog..." : "Creating blog..."
    );

    const formData = new FormData();
    formData.append("blogName", title);
    formData.append("description", description);

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    } else if (blog?.thumbnail?.url && !thumbnailPreview) {
      formData.append("removeThumbnail", "true");
    }

    saveBlogMutation.mutate(formData, {
      onSettled: () => {
        toast.dismiss(toastId);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog management</h1>
          <nav className="text-sm text-gray-500">
            Dashboard / Blog management {" "}
            {blog ? "Edit blog" : "Add blog"}
          </nav>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={handleSubmit}
          disabled={
            saveBlogMutation.isPending || !title.trim() || !description.trim()
          }
        >
          <Save className="h-4 w-4 mr-2" />
          {saveBlogMutation.isPending ? "Saving..." : "Save Blog"}
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Blog Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add your title..."
                  className="text-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Content
                </label>
                <RichTextEditor
                  content={description}
                  onChange={setDescription}
                  placeholder="Start writing your blog content..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <label className="block text-sm font-medium mb-4">
                Thumbnail
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {thumbnailPreview ? (
                  <div className="space-y-4">
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      width={200}
                      height={150}
                      className="mx-auto rounded object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setThumbnail(null);
                        setThumbnailPreview("");
                        toast.info("Thumbnail removed");
                      }}
                    >
                      Remove Thumbnail
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Click to upload thumbnail
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={
                saveBlogMutation.isPending ||
                !title.trim() ||
                !description.trim()
              }
            >
              {saveBlogMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}