"use client"

import { AvatarFallback } from "@/components/ui/avatar"

import { AvatarImage } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, User, Mail, Phone, Shield, CreditCard, AlertTriangle } from "lucide-react"

interface Seller {
  _id: string
  name: string
  email: string
  username: string
  phone: string
  avatar: {
    public_id: string
    url: string
  }
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  verificationInfo: {
    verified: boolean
    token: string
  }
  credit: number | null
  role: string
  fine: number
  uniqueId: string
  createdAt: string
  updatedAt: string
  farm?: string
}

interface SellerDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  seller: Seller
}

export default function SellerDetailsModal({ open, onOpenChange, seller }: SellerDetailsModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Seller Details - {seller.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={seller.avatar?.url || "/placeholder.svg?height=64&width=64"} />
                      <AvatarFallback className="text-lg">{seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-lg">{seller.name}</h4>
                      <p className="text-sm text-muted-foreground">@{seller.username}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Seller ID:</span>
                    <p className="font-mono text-sm">{seller.uniqueId}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Email:</span>
                    <p className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      {seller.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Phone:</span>
                    <p className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {seller.phone}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Role:</span>
                    <Badge variant="secondary" className="ml-2">
                      {seller.role.charAt(0).toUpperCase() + seller.role.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Account Status
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Verification Status:</span>
                    <div className="mt-1">
                      <Badge
                        variant={seller.verificationInfo.verified ? "default" : "secondary"}
                        className="flex items-center gap-1 w-fit"
                      >
                        <Shield className="h-3 w-3" />
                        {seller.verificationInfo.verified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Account Credit:</span>
                    <p className="flex items-center gap-1 text-sm">
                      <CreditCard className="h-3 w-3" />
                      {seller.credit !== null ? `$${seller.credit.toFixed(2)}` : "No credit information"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Outstanding Fines:</span>
                    <p className="flex items-center gap-1 text-sm">
                      <AlertTriangle className="h-3 w-3" />${seller.fine.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Farm Associated:</span>
                    <p className="text-sm">
                      {seller.farm ? (
                        <Badge variant="outline">Farm ID: {seller.farm}</Badge>
                      ) : (
                        <span className="text-muted-foreground">No farm associated</span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Address Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address Information
              </h3>
              <div className="space-y-2">
                {seller.address ? (
                  <>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Street:</span>
                      <p>{seller.address.street}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">City:</span>
                      <p>{seller.address.city}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">State:</span>
                      <p>{seller.address.state}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">ZIP Code:</span>
                      <p className="font-mono">{seller.address.zipCode}</p>
                    </div>
                    <div className="pt-2">
                      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="text-sm">
                          <p>{seller.address.street}</p>
                          <p>
                            {seller.address.city}, {seller.address.state} {seller.address.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No address information available</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Account Timeline */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Account Timeline
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Account Created:</span>
                  <p className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {formatDate(seller.createdAt)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Last Updated:</span>
                  <p className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {formatDate(seller.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
