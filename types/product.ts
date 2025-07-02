// types/product.ts
export interface Review {
  review: string;
  rating: number;
  product: string;
  user?: string;
  createdAt?: Date;
}

export interface Media {
  public_id: string;
  url: string;
  type: string;
  _id: string;
}

export interface Thumbnail {
  public_id: string;
  url: string;
}

export interface Location {
  city: string;
  state: string;
  street: string;
  zipCode: string;
}

export interface Farm {
  _id: string;
  name: string;
  description: string;
  code: string;
  location: Location;
  isOrganic: boolean;
  status: string;
  seller: string;
  createdAt: string;
  updatedAt: string;
  images: Media[];
  videos: Media[];
  reviews: Review[];
}

export interface Category {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  title: string;
  price: number;
  quantity: string;
  category: Category | null;
  media: Media[];
  farm: Farm | null;
  status: string;
  code: string;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
  thumbnail: {
    url: string;
    public_id: string;
  };
  description: string;
  averageRating?: number;
}

// types/product.ts

// ... (your existing types)

export interface PaginationData {
  total: number;       // Total number of items across all pages
  page: number;        // Current page number
  limit: number;       // Number of items per page
  totalPage: number;   // Total number of pages
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
}

export interface ProductListResponse {
  products: Product[];
  pagination: PaginationData;
}