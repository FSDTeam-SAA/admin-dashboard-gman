"use client";

import { CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DeleteConfirmationModal } from "./category-delete-modal";
import PacificPagination from "@/components/ui/PacificPagination";

interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

interface ApiResponse {
  data: {
    categories: Category[];
    pagination: PaginationData;
  };
}

interface CategoryListProps {
  onEdit: (category: Category) => void;
}

export default function CategoryList({ onEdit }: CategoryListProps) {
  const { data: session, status } = useSession();
  const token = (session as { accessToken?: string })?.accessToken;
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse>({
    queryKey: ["categories", page],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    },
    enabled: !!token && status === "authenticated",
  });

  const categories = response?.data.categories ?? [];
  const pagination = response?.data.pagination ?? {
    total: 0,
    page: 1,
    limit,
    totalPage: 1,
  };

  const deleteMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeleteModalOpen(false);
      setSelectedCategoryId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  const handleDeleteClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCategoryId) {
      deleteMutation.mutate(selectedCategoryId);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        Loading session...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center h-64">
        Please log in to view categories.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading categories...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        Error: {error?.message || "Failed to load categories"}
      </div>
    );
  }

  return (
    <>
      <div>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8">No categories found.</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="flex items-center justify-end mr-[30px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category._id}>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>
                        {new Date(category.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-end justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(category)}
                            aria-label={`Edit category ${category.name}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClick(category._id)}
                            disabled={deleteMutation.isPending}
                            aria-label={`Delete category ${category.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4">
                {categories.length > 10 && (
                  <>
                    <div className="text-sm text-muted-foreground">
                      Showing {categories.length} of {pagination.total}{" "}
                      Categories
                    </div>
                    <div>
                      <PacificPagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPage}
                        onPageChange={setPage}
                      />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </CardContent>
      </div>
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
