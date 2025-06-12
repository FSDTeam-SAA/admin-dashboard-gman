"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";

interface Media {
  public_id: string;
  url: string;
  type: string;
  _id: string;
}

interface Thumbnail {
  public_id: string;
  url: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  quantity: string;
  category: string | null;
  media: Media[];
  farm: string;
  status: string;
  code: string;
  review: any[];
  createdAt: string;
  updatedAt: string;
  thumbnail: Thumbnail | null;
}

// interface PaginationData {
//   total: number;
//   page: number;
//   limit: number;
//   totalPage: number;
// }

// interface ApiResponse {
//   success: boolean;
//   data: {
//     products: Product[];
//     pagination: PaginationData;
//   };
// }

// New Product Details Modal Component
interface ProductDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ProductDetailsModal({ open, onOpenChange, product }: ProductDetailsModalProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
          <DialogDescription>Product Details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <strong>Price:</strong> ${product.price}
          </div>
          <div>
            <strong>Quantity:</strong> {product.quantity}
          </div>
          <div>
            <strong>Category:</strong> {product.category || "N/A"}
          </div>
          <div>
            <strong>Farm:</strong> {product.farm}
          </div>
          <div>
            <strong>Status:</strong> {product.status}
          </div>
          <div>
            <strong>Code:</strong> {product.code}
          </div>
          <div>
            <strong>Created At:</strong> {new Date(product.createdAt).toLocaleString()}
          </div>
          <div>
            <strong>Updated At:</strong> {new Date(product.updatedAt).toLocaleString()}
          </div>
          <div>
            <strong>Thumbnail:</strong>
            {product.thumbnail ? (
              <Image
                src={product.thumbnail.url}
                alt={product.title}
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded"
              />
            ) : (
              "No thumbnail"
            )}
          </div>
          <div>
            <strong>Media:</strong>
            {product.media.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {product.media.map((media) => (
                  <Image
                    key={media._id}
                    src={media.url}
                    alt={media.public_id}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
            ) : (
              "No media"
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}