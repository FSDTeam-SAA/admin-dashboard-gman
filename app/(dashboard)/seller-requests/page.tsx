"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import PacificPagination from "@/components/ui/PacificPagination"
import SellerRequestDetails from "./_components/seller-request-details"
import { Trash2 } from "lucide-react"

interface SellerRequest {
  _id: string
  name: string
  description: string
  status: string
  isOrganic: boolean
  location: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  images: Array<{
    url: string
    public_id: string
  }>
  seller: {
    _id: string
    name: string
    email: string
    phone: string
  } | null
  code: string
  createdAt: string
}

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPage: number
}

export default function SellerRequestsPage() {
  const [requests, setRequests] = useState<SellerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<SellerRequest | null>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 5,
    totalPage: 1,
  })


  const { data: session } = useSession()
  const token = (session as { accessToken?: string })?.accessToken

  useEffect(() => {
    fetchSellerRequests()
  }, [page])

  const fetchSellerRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/seller-requests?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch seller requests")
      }

      const data = await response.json()
      if (data.success) {
        setRequests(data.data.sellerRequests)
        setPagination(data.data.pagination)
      }
    } catch (error) {
      console.error("Error fetching seller requests:", error)
      toast.error("Failed to fetch seller requests")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/seller-requests/${id}/approve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to approve request")
      }

      toast.success("Seller request approved successfully")
      fetchSellerRequests()
    } catch{
      toast.error("Failed to approve seller request")
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/seller-requests/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to reject request")
      }

      toast.success("Seller request rejected successfully")
      fetchSellerRequests()
    } catch {
      toast.error("Failed to reject seller request")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Profile Request</h1>
          <nav className="text-sm text-gray-500">Dashboard &gt; Seller Profile Request</nav>
        </div>
        <div className="bg-green-600 text-white px-4 py-2 rounded">
          <div className="text-sm">Total Request</div>
          <div className="text-lg font-bold">{pagination.total.toLocaleString()}</div>
        </div>
      </div>

      <Card className="bg-transparent shadow-none border-none">
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow className="text-base text-[#272727] font-medium">
                <TableHead>Seller ID</TableHead>
                <TableHead>Seller Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <TableRow className="text-base text-[#595959] font-medium" key={request._id}>
                    <TableCell className="font-mono">{request.code}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>{request.seller?.name?.charAt(0) || request.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{request.seller?.name || request.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {request.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                              onClick={() => handleApprove(request._id)}
                            >
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(request._id)}>
                              <Trash2 className="h-4 w-4 text-white" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)}>
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No seller requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {pagination.totalPage > 10 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {requests.length} of {pagination.total} requests
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
        </CardContent>
      </Card>

      {selectedRequest && (
        <SellerRequestDetails
          open={!!selectedRequest}
          onOpenChange={() => setSelectedRequest(null)}
          request={selectedRequest}
        />
      )}
    </div>
  )
}
