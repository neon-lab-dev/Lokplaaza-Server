export type TProduct = {
  productId: string;
  imageUrls: string[];
  name: string;
  description: string;
  clothDetails?: string;
  productStory?: string;
  category: string;
  madeIn?: string;
  colors: {
    colorName: string;
    sizes: {
      size: string;
      quantity: number;
      basePrice: number;
      discountedPrice: number;
    }[];
  }[];
  createdAt?: Date;
  updatedAt?: Date;
};
