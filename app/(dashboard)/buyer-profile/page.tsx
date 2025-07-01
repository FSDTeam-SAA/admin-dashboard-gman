"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import PacificPagination from "@/components/ui/PacificPagination"
import BuyerDetailsModal from "./_components/buyer-details-modal"

interface User {
  _id: string
  name: string
  email: string
  phone: string
}

interface UserOrderSummary {
  user: User
  pending: number
  completed: number
  shipping: number
  cancelled: number
}

interface ApiResponse {
  success: boolean
  message: string
  data: UserOrderSummary[]
}

export default function BuyerProfilePage() {
  const [page, setPage] = useState(1)
  const [selectedBuyer, setSelectedBuyer] = useState<UserOrderSummary | null>(null)
  const { toast } = useToast()

  const {
    data: buyersData,
    isLoading,
    error,
  } = useQuery<ApiResponse>({
    queryKey: ["buyers", page],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/user-profile?page=${page}&limit=10`,
      )
      if (!response.ok) {
        throw new Error("Failed to fetch buyer profiles")
      }
      return response.json()
    },
  })

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch buyer profiles",
      variant: "destructive",
    })
  }

  const buyers = buyersData?.data || []
  const totalBuyers = buyers.length

  // Calculate pagination (assuming API doesn't provide pagination info)
  const itemsPerPage = 10
  const totalPages = Math.ceil(totalBuyers / itemsPerPage)

  if (isLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          <nav className="text-sm text-gray-500">Dashboard &gt; User Profile</nav>
        </div>
        <div className="bg-green-600 text-white px-4 py-2 rounded">
          <div className="text-sm">Total Users</div>
          <div className="text-lg font-bold">{totalBuyers.toLocaleString()}</div>
        </div>
      </div>

      <Card className="bg-transparent border-none shadow-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="text-base text-[#272727] font-midium">
                <TableHead>User ID</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Cancelled</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buyers.length > 0 ? (
                buyers.map((buyer) => {
                  const totalOrders = buyer.pending + buyer.completed + buyer.shipping + buyer.cancelled
                  return (
                    <TableRow className="text-base text-[#595959] font-medium" key={buyer.user._id}>
                      <TableCell className="font-mono">{buyer.user._id.slice(-6)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback>{buyer.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">{buyer.user.name}</span>
                            <div className="text-xs text-muted-foreground">{buyer.user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{totalOrders}</TableCell>
                      <TableCell>
                        <span className="text-green-600 font-medium">{buyer.completed}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-yellow-600 font-medium">{buyer.pending + buyer.shipping}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-red-600 font-medium">{buyer.cancelled}</span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50 cursor-pointer"
                          onClick={() => setSelectedBuyer(buyer)}
                        >
                          See Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No buyers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4">
              <div className="text-sm text-muted-foreground">
                Showing {buyers.length} of {totalBuyers} users
              </div>
              <div>
                <PacificPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Buyer Details Modal */}
      {selectedBuyer && (
        <BuyerDetailsModal open={!!selectedBuyer} onOpenChange={() => setSelectedBuyer(null)} buyer={selectedBuyer} />
      )}
    </div>
  )
}
