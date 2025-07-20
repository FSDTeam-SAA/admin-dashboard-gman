"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import PacificPagination from "@/components/ui/PacificPagination";
import { BlogForm } from "./_components/blog-form";
import { DeleteConfirmDialog } from "./_components/delete-confirm-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

interface BlogsResponse {
  success: boolean;
  data: {
    blogs: Blog[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPage: number;
    };
  };
}

export default function BlogManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const session = useSession();
  const token = (session?.data as { accessToken?: string })?.accessToken;
  const queryClient = useQueryClient();

  const {
    data: blogsData,
    isLoading,
    error,
  } = useQuery<BlogsResponse>({
    queryKey: ["blogs", currentPage],
    queryFn: async () => {
      if (!token) throw new Error("Authentication token missing");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs?page=${currentPage}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      return response.json();
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (blogsData?.data?.blogs) {
      console.log("Blogs data:", blogsData.data.blogs);
      blogsData.data.blogs.forEach((blog: Blog, index: number) => {
        if (!blog.thumbnail) {
          console.warn(`Blog at index ${index} has no thumbnail`, blog);
        }
      });
    }
  }, [blogsData]);

  const deleteBlogMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Authentication token missing");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setDeleteId(null);
    },
  });

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteBlogMutation.mutate(deleteId);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["blogs"] });
    handleFormClose();
  };

  if (showForm) {
    return (
      <BlogForm
        blog={editingBlog}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error loading blogs. Please try again.
      </div>
    );
  }

  const blogs = blogsData?.data.blogs || [];
  const pagination = blogsData?.data.pagination || {
    total: 0,
    page: 1,
    limit: 5,
    totalPage: 1,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog management</h1>
          <nav className="text-sm text-gray-500">
            Dashboard / Blog management / List
          </nav>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700 cursor-pointer"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Blog
        </Button>
      </div>

      <Card className="bg-transparent shadow-none border-none">
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="text-base text-[#272727] font-medium">
                <TableHead>Thumbnail</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow className="text-base text-[#595959] font-medium" key={blog._id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Image
                        src={blog.thumbnail?.url || "/placeholder.svg"}
                        alt={blog.blogName}
                        width={60}
                        height={40}
                        className="rounded object-cover"
                      />
                      <div>
                        <p className="font-semibold">{blog.blogName}</p>
                        <p
                          className="line-clamp-1 max-w-[200px]"
                          dangerouslySetInnerHTML={{
                            __html: blog?.description || "No description",
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(blog.createdAt).toLocaleDateString()}
                    <br />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(blog)}
                        className="cursor-pointer"
                      >
                        <Edit className="h-4 w-4 cursor-pointer" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(blog._id)}
                        disabled={deleteBlogMutation.isPending}
                        className="cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {blogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No blogs found. Create your first blog!
            </div>
          )}

          {pagination.totalPage > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {blogs.length} of {pagination.total} Blogs
              </div>
              <PacificPagination
                currentPage={pagination.page}
                totalPages={pagination.totalPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Blog"
        description="Are you sure you want to delete this blog? This action cannot be undone."
        isLoading={deleteBlogMutation.isPending}
      />
    </div>
  );
}