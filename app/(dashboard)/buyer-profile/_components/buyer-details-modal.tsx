"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, ShoppingCart, CheckCircle, Clock, XCircle, Truck, LucideUser } from "lucide-react"

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

interface BuyerDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  buyer: UserOrderSummary
}

export default function BuyerDetailsModal({ open, onOpenChange, buyer }: BuyerDetailsModalProps) {
  const totalOrders = buyer.pending + buyer.completed + buyer.shipping + buyer.cancelled

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LucideUser className="h-5 w-5" />
            User Details - {buyer.user.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <LucideUser className="h-4 w-4" />
                Personal Information
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback className="text-lg">{buyer.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-lg">{buyer.user.name}</h4>
                  <p className="text-sm text-muted-foreground">Customer ID: {buyer.user._id.slice(-8)}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Email:</span>
                  <p className="flex items-center gap-1 text-sm">
                    <Mail className="h-3 w-3" />
                    {buyer.user.email}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Phone:</span>
                  <p className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3" />
                    {buyer.user.phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Order Statistics */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Order Statistics
              </h3>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{totalOrders}</div>
                  <div className="text-sm text-blue-600 font-medium">Total Orders</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{buyer.completed}</div>
                  <div className="text-sm text-green-600 font-medium">Completed</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{buyer.pending + buyer.shipping}</div>
                  <div className="text-sm text-yellow-600 font-medium">In Progress</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{buyer.cancelled}</div>
                  <div className="text-sm text-red-600 font-medium">Cancelled</div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Completed Orders</span>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {buyer.completed}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Pending Orders</span>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {buyer.pending}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Shipping Orders</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {buyer.shipping}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Cancelled Orders</span>
                  </div>
                  <Badge variant="destructive" className="bg-red-100 text-red-800">
                    {buyer.cancelled}
                  </Badge>
                </div>
              </div>

              {/* Success Rate */}
              {totalOrders > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((buyer.completed / totalOrders) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Order Success Rate</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
