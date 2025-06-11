"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Mock data for donations
const mockDonations = [
  {
    id: "1",
    name: "Mr. Raja",
    email: "raja24@gmail.com",
    amount: 500,
    comments: "Lorem Ipsum is simply dummy text of the printing...",
    date: "04/10/2025 09:46am",
  },
  {
    id: "2",
    name: "Ms. Sarah",
    email: "sarah@gmail.com",
    amount: 300,
    comments: "Lorem Ipsum is simply dummy text of the printing...",
    date: "04/10/2025 09:46am",
  },
  {
    id: "3",
    name: "Mr. John",
    email: "john@gmail.com",
    amount: 750,
    comments: "Lorem Ipsum is simply dummy text of the printing...",
    date: "04/10/2025 09:46am",
  },
]

export default function DonationsPage() {
  const [donations, setDonations] = useState(mockDonations)

  console.log(setDonations)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
        <nav className="text-sm text-gray-500">Dashboard &gt; Donations</nav>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Mail</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">{donation.name}</TableCell>
                  <TableCell>{donation.email}</TableCell>
                  <TableCell>${donation.amount}</TableCell>
                  <TableCell className="max-w-xs truncate">{donation.comments}</TableCell>
                  <TableCell>{donation.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center p-4 border-t">
            <p className="text-sm text-gray-600">Showing 1 to 5 of 12 results</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
