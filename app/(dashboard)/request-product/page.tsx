"use client";

import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteConfirmationModal } from "./_components/delete-confirmation-modal";
import { ProductDetailsModal } from "./_components/ProductDetailsModal";
import PacificPagination from "@/components/ui/PacificPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaginationData, Product } from "@/types/product";
import Image from "next/image";

interface ApiResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: PaginationData;
  };
}

export default function RequestProductPage() {
  const { data: session, status } = useSession();
  const token = (session as { accessToken?: string })?.accessToken;

  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const limit = 10;

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse>({
    queryKey: ["request-products", page],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/request-products?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch product requests");
      }
      return response.json() as Promise<ApiResponse>;
    },
    enabled: !!token && status === "authenticated",
    retry: 3,
  });

  const products = response?.data.products ?? [];
  const pagination = response?.data.pagination ?? {
    total: 0,
    page: 1,
    limit,
    totalPage: 1,
  };

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/request-products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete product request");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Product request deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["request-products"] });
      setDeleteModalOpen(false);
      setSelectedProductId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete product request");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      productId,
      status,
    }: {
      productId: string;
      status: string;
    }) => {
      const endpoint =
        status === "approve"
          ? `${process.env.NEXT_PUBLIC_API_URL}/admin/request-products/${productId}/approve`
          : `${process.env.NEXT_PUBLIC_API_URL}/admin/request-products/${productId}/pending`;
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to update product status to ${status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Product status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["request-products"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update product status");
    },
  });

  const handleDeleteClick = (productId: string) => {
    setSelectedProductId(productId);
    setDeleteModalOpen(true);
  };

  const handleViewClick = (product: Product) => {
    setSelectedProduct(product);
    setDetailsModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedProductId) {
      deleteMutation.mutate(selectedProductId);
    }
  };

  const handleStatusChange = (productId: string, newStatus: string) => {
    updateStatusMutation.mutate({ productId, status: newStatus });
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
        Please log in to view product requests.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading product requests...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        Error: {error?.message || "Failed to load product requests"}
      </div>
    );
  }

  console.log(products);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Request Product</h1>
        <nav className="text-sm text-muted-foreground">
          Dashboard &gt; Request Product
        </nav>
      </div>

      <div>
        <CardHeader>
          <CardTitle>Product Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No product requests found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="text-base text-[#272727] font-medium">
                    <TableHead>Product Name</TableHead>
                    <TableHead>Farm Name</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div className="flex gap-2">
                          <Image
                            src={product.thumbnail.url}
                            alt={product.title}
                            width={500}
                            height={500}
                            className="w-[100px] h-[60px]"
                          />
                          <p>{product.title}</p>
                        </div>
                      </TableCell>
                      <TableCell>{product.farm?.name || "N/A"}</TableCell>
                      <TableCell>{product.code}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.quantity} /Box</TableCell>
                      <TableCell>
                        {new Date(product.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={product.status}
                          onValueChange={(value) =>
                            handleStatusChange(product._id, value)
                          }
                          disabled={
                            updateStatusMutation.isPending ||
                            deleteMutation.isPending
                          }
                        >
                          <SelectTrigger className="w-[120px] bg-[#039B06] text-white cursor-pointer">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approve">Approve</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewClick(product)}
                          disabled={
                            deleteMutation.isPending ||
                            updateStatusMutation.isPending
                          }
                          aria-label={`View product details for ${product.title}`}
                          className="cursor-pointer bg-[#039B06] text-white hover:text-[#039B06]"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(product._id)}
                          disabled={
                            deleteMutation.isPending ||
                            updateStatusMutation.isPending
                          }
                          aria-label={`Delete product request ${product.title}`}
                          className="cursor-pointer bg-[#039B06] text-white hover:text-[#039B06]"
                        >
                          <Trash2 className="h-4 w-4 " />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4">
                {pagination.totalPage > 10 && (
                  <>
                    <div className="text-sm text-muted-foreground">
                      Showing {products.length} of {pagination.total} product
                      requests
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
      <ProductDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        product={selectedProduct}
      />
    </div>
  );
}
