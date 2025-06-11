"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface RevenueData {
  farm: {
    _id: string
    name: string
  }
  product: {
    _id: string
    name: string
  }
  adminRevenue: number
}

export default function RevenuePage() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRevenueData()
  }, [])

  const fetchRevenueData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/admin-reveneu`)
      const data = await response.json()
      if (data.success) {
        setRevenueData(data.data)
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.adminRevenue, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Revenue from Seller</h1>
        <nav className="text-sm text-gray-500">Dashboard &gt; Revenue from Seller</nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Admin revenue (4.99%)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farm Name</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Admin Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.farm.name}</TableCell>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>${item.adminRevenue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
