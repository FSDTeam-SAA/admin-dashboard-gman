"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data since the API endpoint structure isn't clear from the provided info
const mockSellers = [
  { id: "2201", name: "John Smith", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "2202", name: "Jane Doe", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "2203", name: "Bob Wilson", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "2204", name: "Alice Brown", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "2205", name: "Charlie Davis", avatar: "/placeholder.svg?height=32&width=32" },
]

export default function SellerProfilePage() {
  const [sellers, setSellers] = useState(mockSellers)
  console.log(setSellers)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Profile</h1>
          <nav className="text-sm text-gray-500">Dashboard &gt; Seller Profile</nav>
        </div>
        <div className="bg-green-600 text-white px-4 py-2 rounded">
          <div className="text-sm">Total Seller</div>
          <div className="text-lg font-bold">4,200.00</div>
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
              {sellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell>{seller.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={seller.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{seller.name}</span>
                    </div>
                  </TableCell>
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
