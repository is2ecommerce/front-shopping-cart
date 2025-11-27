import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Mock data de productos
  private mockProducts: Product[] = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Wireless Bluetooth Headphones',
      description: 'Premium noise-cancelling headphones with 30-hour battery life',
      price: 89.99,
      imageUrl: 'https://co.tiendasishop.com/cdn/shop/files/IMG-14858589.jpg?v=1726245557',
      category: 'Electronics',
      stock: 15,
      rating: 4.5,
      metadata: ['Color: Black', 'Version: Pro 2']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Premium Cotton T-Shirt',
      description: 'Comfortable 100% organic cotton t-shirt, perfect for everyday wear',
      price: 29.99,
      imageUrl: 'https://peopleplays.vtexassets.com/arquivos/ids/511458-800-auto?v=638731773540670000&width=800&height=auto&aspect=true',
      category: 'Clothing',
      stock: 50,
      rating: 4.3,
      metadata: ['Size: S, M, L, XL', 'Material: 100% Cotton']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174002',
      name: 'Leather Wallet',
      description: 'Handcrafted genuine leather wallet with RFID protection',
      price: 49.99,
      imageUrl: 'https://m.media-amazon.com/images/I/81qlL+JqgEL._AC_SY695_.jpg',
      category: 'Accessories',
      stock: 30,
      rating: 4.7,
      metadata: ['Color: Brown', 'Material: Genuine Leather']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174003',
      name: 'Smart Watch Series 8',
      description: 'Advanced fitness tracking with heart rate monitor and GPS',
      price: 299.99,
      imageUrl: 'https://m.media-amazon.com/images/I/71uZXFwXQzL._AC_SL1500_.jpg',
      category: 'Electronics',
      stock: 8,
      rating: 4.8,
      metadata: ['Color: Space Gray', 'Size: 44mm']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174004',
      name: 'Running Shoes Ultraboost',
      description: 'Responsive cushioning for a comfortable running experience',
      price: 129.99,
      imageUrl: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/a284c05789e64be281506dbda3204ed0_9366/Tenis_Ultraboost_5_Turquesa_JQ2911_HM1.jpg',
      category: 'Sports',
      stock: 25,
      rating: 4.6,
      metadata: ['Color: Blue-Green', 'Size: 7-12']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174005',
      name: 'Portable Bluetooth Speaker',
      description: 'Waterproof speaker with 360° sound and 12-hour battery',
      price: 79.99,
      imageUrl: 'https://m.media-amazon.com/images/I/81+W5wfGy6L._AC_SL1500_.jpg',
      category: 'Electronics',
      stock: 20,
      rating: 4.4,
      metadata: ['Color: Black', 'Waterproof: IPX7']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174006',
      name: 'Stainless Steel Water Bottle',
      description: 'Insulated bottle keeps drinks cold for 24h or hot for 12h',
      price: 24.99,
      imageUrl: 'https://m.media-amazon.com/images/I/61nRZOhhGfL._AC_SL1500_.jpg',
      category: 'Accessories',
      stock: 100,
      rating: 4.9,
      metadata: ['Size: 750ml', 'Material: Stainless Steel']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174007',
      name: 'Wireless Gaming Mouse',
      description: 'High-precision sensor with customizable RGB lighting',
      price: 59.99,
      imageUrl: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg',
      category: 'Electronics',
      stock: 12,
      rating: 4.5,
      metadata: ['DPI: 16000', 'Battery: 70h']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174008',
      name: 'Yoga Mat Premium',
      description: 'Non-slip eco-friendly yoga mat with carrying strap',
      price: 34.99,
      imageUrl: 'https://m.media-amazon.com/images/I/81V7Y5Z7VYL._AC_SL1500_.jpg',
      category: 'Sports',
      stock: 40,
      rating: 4.7,
      metadata: ['Thickness: 6mm', 'Material: TPE']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174009',
      name: 'Coffee Maker Automatic',
      description: 'Programmable coffee maker with thermal carafe',
      price: 89.99,
      imageUrl: 'https://m.media-amazon.com/images/I/71ZvCLwNJJL._AC_SL1500_.jpg',
      category: 'Home',
      stock: 18,
      rating: 4.6,
      metadata: ['Capacity: 12 cups', 'Timer: 24h']
    }
  ];

  constructor() {}

  /**
   * Obtiene todos los productos (simulado con delay para parecer petición real)
   */
  getProducts(): Observable<Product[]> {
    return of(this.mockProducts).pipe(delay(300));
  }

  /**
   * Obtiene productos filtrados
   */
  getFilteredProducts(filters: any): Observable<Product[]> {
    let filtered = [...this.mockProducts];

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
      );
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }

    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    return of(filtered).pipe(delay(300));
  }

  /**
   * Obtiene un producto por ID
   */
  getProductById(id: string): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product).pipe(delay(200));
  }

  /**
   * Obtiene categorías únicas
   */
  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.mockProducts.map(p => p.category))];
    return of(categories);
  }
}
