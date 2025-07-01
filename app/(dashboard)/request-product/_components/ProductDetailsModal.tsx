"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import type { Product } from "@/types/product";

interface ProductDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ProductDetailsModal({
  open,
  onOpenChange,
  product,
}: ProductDetailsModalProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
          <DialogDescription>Product Details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <div>
            <strong>ID:</strong> {product._id}
          </div>
          <div>
            <strong>Price:</strong> ${product.price}
          </div>
          <div>
            <strong>Quantity:</strong> {product.quantity}
          </div>
          <div>
            <strong>Description:</strong> {product.description || "N/A"}
          </div>
          <div>
            <strong>Category:</strong> {product.category?.name || "N/A"}
          </div>
          <div>
            <strong>Farm:</strong> {product.farm?.name || "N/A"}
          </div>
          {product.farm && (
            <div className="ml-4">
              <div>
                <strong>Farm Description:</strong> {product.farm.description || "N/A"}
              </div>
              <div>
                <strong>Farm Code:</strong> {product.farm.code || "N/A"}
              </div>
              <div>
                <strong>Farm Organic:</strong> {product.farm.isOrganic ? "Yes" : "No"}
              </div>
              <div>
                <strong>Farm Status:</strong> {product.farm.status || "N/A"}
              </div>
              <div>
                <strong>Farm Location:</strong>
                <div className="ml-4">
                  <div>
                    <strong>City:</strong> {product.farm.location?.city || "N/A"}
                  </div>
                  <div>
                    <strong>State:</strong> {product.farm.location?.state || "N/A"}
                  </div>
                  <div>
                    <strong>Street:</strong> {product.farm.location?.street || "N/A"}
                  </div>
                  <div>
                    <strong>Zip Code:</strong> {product.farm.location?.zipCode || "N/A"}
                  </div>
                </div>
              </div>
              <div>
                <strong>Farm Created At:</strong> {new Date(product.farm.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>Farm Updated At:</strong> {new Date(product.farm.updatedAt).toLocaleString()}
              </div>
              <div>
                <strong>Farm Images:</strong>
                {product.farm.images?.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {product.farm.images.map((image) => (
                      <Image
                        key={image._id}
                        src={image.url}
                        alt={image.public_id}
                        width={96}
                        height={96}
                        className="w-24 h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                ) : (
                  "No farm images"
                )}
              </div>
              <div>
                <strong>Farm Videos:</strong>
                {product.farm.videos?.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {product.farm.videos.map((video) => (
                      <video
                        key={video._id}
                        src={video.url}
                        controls
                        className="w-24 h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                ) : (
                  "No farm videos"
                )}
              </div>
            </div>
          )}
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
            {product.media?.length > 0 ? (
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
          <div>
            <strong>Reviews:</strong>
            {product.reviews?.length > 0 ? (
              <div className="space-y-2">
                {product.reviews.map((review, index) => (
                  <div key={index} className="border p-2 rounded">
                    <div>
                      <strong>Rating:</strong> {review.rating}
                    </div>
                    <div>
                      <strong>Review:</strong> {review.review}
                    </div>
                    <div>
                      <strong>User:</strong> {review.user || "Anonymous"}
                    </div>
                    <div>
                      <strong>Posted:</strong>{" "}
                      {review.createdAt ? new Date(review.createdAt).toLocaleString() : "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              "No reviews"
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}