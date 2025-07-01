"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import PacificPagination from "@/components/ui/PacificPagination";

interface RevenueData {
  farm: {
    _id: string;
    name: string;
  };
  product: {
    _id: string;
    name: string;
  };
  adminRevenue: number;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export default function RevenuePage() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPage: 1,
  });

  useEffect(() => {
    fetchRevenueData();
  }, [page]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/admin-reveneu?page=${page}&limit=${limit}`
      );
      const data = await response.json();
      console.log("DDDDDDDDDDDDDD", data)
      if (data.success) {
        setRevenueData(data.data);
        setPagination(
          data.pagination || {
            total: data.data.length,
            page,
            limit,
            totalPage: Math.ceil(data.data.length / limit),
          }
        );
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }



  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Revenue from Seller
          </h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <Breadcrumb className="flex space-x-1">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          &gt;
          <BreadcrumbItem>
            <BreadcrumbLink className="ml-1">
              Revenue from Seller &gt; List
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="text-base text-[#272727] font-medium">
            <TableHead>Farm Name</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead className="text-right">Admin Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {revenueData.map((item, index) => (
            <TableRow className="text-base text-[#595959] font-normal" key={index}>
              <TableCell className="font-medium">{item.farm.name}</TableCell>
              <TableCell>{item.product.name}</TableCell>
              <TableCell className="text-right">
                ${item.adminRevenue.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination.total > limit && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {revenueData.length} of {pagination.total} Records
          </div>
          <div>
            <PacificPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPage}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
