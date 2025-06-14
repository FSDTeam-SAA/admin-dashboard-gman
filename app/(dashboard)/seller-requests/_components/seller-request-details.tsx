"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { MapPin, Calendar, User, Mail, Phone, Package } from "lucide-react"

interface SellerRequestDetailsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: {
    _id: string
    name: string
    description: string
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
      name: string
      email: string
      phone: string
    } | null
    code: string
    createdAt: string
    status: string
  }
}

export function SellerRequestDetails({ open, onOpenChange, request }: SellerRequestDetailsProps) {
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
            <Package className="h-5 w-5" />
            Seller Request Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Basic Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Request ID:</span>
                  <p className="font-mono">{request.code}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Farm/Business Name:</span>
                  <p>{request.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  <div className="mt-1">
                    <Badge
                      variant={
                        request.status === "pending"
                          ? "secondary"
                          : request.status === "approved"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Organic Certification:</span>
                  <div className="mt-1">
                    <Badge variant={request.isOrganic ? "default" : "secondary"}>
                      {request.isOrganic ? "Organic" : "Conventional"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Submitted:</span>
                  <p className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(request.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Contact Information</h3>
              {request.seller ? (
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Name:</span>
                    <p className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {request.seller.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Email:</span>
                    <p className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {request.seller.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Phone:</span>
                    <p className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {request.seller.phone}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No seller information available</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-sm leading-relaxed bg-muted/50 p-4 rounded-lg">
              {request.description || "No description provided"}
            </p>
          </div>

          <Separator />

          {/* Location */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Location</h3>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p>{request.location.street}</p>
                <p>
                  {request.location.city}, {request.location.state} {request.location.zipCode}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Images */}
          {request.images.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Farm Images</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {request.images.map((image, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden bg-muted/50">
                    <div className="aspect-video relative">
                      <Image
                        src={image.url || "/placeholder.svg?height=200&width=300"}
                        alt={`Farm image ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized={true}
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-muted-foreground truncate">Image {index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SellerRequestDetails
