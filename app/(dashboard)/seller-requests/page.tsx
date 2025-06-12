"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { X } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

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

export default function SellerRequestsPage() {
  const [requests, setRequests] = useState<SellerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<SellerRequest | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchSellerRequests()
  }, [])

  const fetchSellerRequests = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/seller-requests`)
      const data = await response.json()
      if (data.success) {
        setRequests(data.data.sellerRequests)
      }
    } catch (error) {
      console.error("Error fetching seller requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/seller-requests/${id}/approve`, {
        method: "PATCH",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Seller request approved successfully",
        })
        fetchSellerRequests()
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to approve seller request",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
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
          <div className="text-lg font-bold">{requests.length.toLocaleString()}</div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller ID</TableHead>
                <TableHead>Seller Name</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.code}</TableCell>
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
                    <div className="flex gap-2">
                      {request.status === "pending" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApprove(request._id)}
                        >
                          Approved
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)}>
                            See Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Seller Request Details</DialogTitle>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold">Farm Name: {selectedRequest.name}</h3>
                                <p className="text-sm text-gray-600">{selectedRequest.description}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Location:</h4>
                                <p className="text-sm">
                                  {selectedRequest.location.street}, {selectedRequest.location.city},{" "}
                                  {selectedRequest.location.state} {selectedRequest.location.zipCode}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium">Organic: {selectedRequest.isOrganic ? "Yes" : "No"}</h4>
                              </div>
                              {selectedRequest.images.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Images:</h4>
                                  <div className="grid grid-cols-3 gap-2">
                                    {selectedRequest.images.map((image, index) => (
                                      <Image
                                        key={index}
                                        src={image.url || "/placeholder.svg"}
                                        alt={`Farm image ${index + 1}`}
                                        width={100}
                                        height={80}
                                        className="rounded object-cover"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="p-4 border-t">
            <p className="text-sm text-gray-600">
              Showing 1 to {requests.length} of {requests.length} results
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
