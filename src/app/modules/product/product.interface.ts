export type TProduct = {
  productId: string;
  imageUrls: string[];
  arFileUrl?: string;
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
  customizationFields: {
    key: string;
    label: string;
    type: "text" | "number" | "dropdown" | "checkbox" | "textarea";
    options?: string[];
    placeholder?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};