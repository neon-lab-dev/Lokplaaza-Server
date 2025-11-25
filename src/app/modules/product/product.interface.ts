export type TProduct = {
  productId: string;
  imageUrls: string[];
  name: string;
  category: string;
  description: string;
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