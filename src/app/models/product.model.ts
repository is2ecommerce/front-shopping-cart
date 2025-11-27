export interface Product {
  id: string;           // UUID del producto
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  rating?: number;
  metadata?: string[];  // Atributos como "Color: Blue", "Size: M"
}

export interface CatalogFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  inStock?: boolean;
}
