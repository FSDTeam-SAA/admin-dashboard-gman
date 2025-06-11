"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for buyer profiles
const mockBuyers = [
  {
    id: "2201",
    name: "John Smith",
    avatar: "/placeholder.svg?height=32&width=32",
    totalOrder: 200,
    deliveredOrder: 170,
    pendingOrder: 17,
    cancelOrder: 13,
  },
  {
    id: "2202",
    name: "Jane Doe",
    avatar: "/placeholder.svg?height=32&width=32",
    totalOrder: 150,
    deliveredOrder: 130,
    pendingOrder: 12,
    cancelOrder: 8,
  },
  {
    id: "2203",
    name: "Bob Wilson",
    avatar: "/placeholder.svg?height=32&width=32",
    totalOrder: 180,
    deliveredOrder: 160,
    pendingOrder: 15,
    cancelOrder: 5,
  },
]

export default function BuyerProfilePage() {
  const [buyers, setBuyers] = useState(mockBuyers)
  console.log(setBuyers)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          <nav className="text-sm text-gray-500">Dashboard &gt; User Profile</nav>
        </div>
        <div className="bg-green-600 text-white px-4 py-2 rounded">
          <div className="text-sm">Total User</div>
          <div className="text-lg font-bold">4,200.00</div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Total Order</TableHead>
                <TableHead>Delivered Order</TableHead>
                <TableHead>Pending Order</TableHead>
                <TableHead>Cancel Order</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buyers.map((buyer) => (
                <TableRow key={buyer.id}>
                  <TableCell>{buyer.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={buyer.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{buyer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{buyer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{buyer.totalOrder}</TableCell>
                  <TableCell>{buyer.deliveredOrder}</TableCell>
                  <TableCell>{buyer.pendingOrder}</TableCell>
                  <TableCell>{buyer.cancelOrder}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                      See Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="p-4 border-t">
            <p className="text-sm text-gray-600">Showing 1 to 5 of 12 results</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
