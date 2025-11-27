// Modelos TypeScript que mapean con las clases Java del backend

export interface CartItem {
  productId: string;          // UUID en backend
  name?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  metadata?: string[];        // chips como "Color: Black"
}

export interface ShoppingCart {
  userId: string;             // UUID en backend
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductDTO {
  productId: string;          // UUID
  price: number;
  isAvailable: boolean;
  stock: number;
}

export interface CheckoutRequest {
  userId: string;
  paymentMethod: 'credit-card' | 'paypal' | 'debit-card';
  cardDetails?: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
  };
  email: string;
}

export interface CheckoutResponse {
  orderId: string;
  status: 'success' | 'failed';
  message?: string;
}
