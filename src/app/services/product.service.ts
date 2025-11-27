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
      imageUrl: 'https://m.media-amazon.com/images/I/71sBygGN7TL._AC_SL1500_.jpg',
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
      imageUrl: 'https://shirtsandprints.ph/wp-content/uploads/2019/07/round-neck.jpg',
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
      imageUrl: 'https://www.graphicimage.com/cdn/shop/files/WLM-HAR-BRN-2_fd9e006c-47ad-4c6e-bb73-716e757542b4.jpg?v=1684737127',
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
      imageUrl: 'https://www.killaclock.com.co/cdn/shop/files/SmartWatchserie8.webp?v=1708783355',
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
      imageUrl: 'https://www.sneaker10.gr/2702879-product_large/adidas-ultraboost-light-w.jpg',
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
      imageUrl: 'https://www.tronsmart.com/3814-home_default/tronsmart-t7-mini-portable-bluetooth-speaker.jpg',
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
      imageUrl: 'https://buffer.cl/cdn/shop/files/9d51c1b0-ae8d-4e51-a4e3-abeb2fef24e0_512x512.png?v=1760038040',
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
      imageUrl: 'https://megacomputer.com.co/wp-content/uploads/2021/03/MOUSE-G502-LIGHTSPEED-BLACK-INALAMBRICO.jpg',
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
      imageUrl: 'https://cdn11.bigcommerce.com/s-p89g8w2tc9/products/522/images/1545/Mat-de-Yoga-Premium-PU-Natural-Rubber-5-mm__09886.1705499696.1280.1280.jpg?c=1',
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
      imageUrl: 'https://www.zulaykitchen.com/cdn/shop/files/Zulay-Magia-Super-Automatic-Espresso-Machine-Zulay-Kitchen-35687245381870_2000x.png?v=1750451895',
      category: 'Home',
      stock: 18,
      rating: 4.6,
      metadata: ['Capacity: 12 cups', 'Timer: 24h']
    },
    // iPhones
    {
      id: '123e4567-e89b-12d3-a456-426614174010',
      name: 'iPhone 15 Pro Max',
      description: 'Titanium design with A17 Pro chip, advanced camera system',
      price: 1199.99,
      imageUrl: 'https://co.nixblix.com/cdn/shop/files/27439196537008-iphone_15_pro_max_blue_titanium_pdp_image_position-1__coes.jpg?v=1753466314',
      category: 'Electronics',
      stock: 10,
      rating: 4.9,
      metadata: ['Storage: 256GB', 'Color: Natural Titanium']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174011',
      name: 'iPhone 17',
      description: 'Dynamic Island, 48MP main camera, USB-C connection',
      price: 999.99,
      imageUrl: 'https://co.tiendasishop.com/cdn/shop/files/IMG-18067790_m_jpeg_1_482e00e7-633b-43e4-8f45-fa0eaa0c3e30.jpg?v=1757469369',
      category: 'Electronics',
      stock: 15,
      rating: 4.8,
      metadata: ['Storage: 128GB', 'Color: Black']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174012',
      name: 'iPhone 17 Pro',
      description: 'All-day battery life, advanced dual-camera system',
      price: 1999.99,
      imageUrl: 'https://www.losdistribuidores.com/wp-content/uploads/2025/09/iphone-17-pro-max-naranjado.webp',
      category: 'Electronics',
      stock: 20,
      rating: 4.7,
      metadata: ['Storage: 128GB', 'Color: Midnight']
    },
    // Camisetas de Fútbol
    {
      id: '123e4567-e89b-12d3-a456-426614174014',
      name: 'FC Barcelona Home Jersey 2025',
      description: 'Official home kit with Dri-FIT technology',
      price: 89.99,
      imageUrl: 'https://www.soccerbible.com/media/171662/b7-min.jpg',
      category: 'Clothing',
      stock: 30,
      rating: 4.8,
      metadata: ['Size: S, M, L, XL', 'Season: 2024']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174015',
      name: 'Real Madrid Home Jersey 2025',
      description: 'Official home kit with HEAT.RDY technology',
      price: 89.99,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMcLwkc8TtgXVY4vumYeOJE0hgkuD4UkD1nw&s',
      category: 'Clothing',
      stock: 28,
      rating: 4.8,
      metadata: ['Size: S, M, L, XL', 'Season: 2024']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174016',
      name: 'Manchester United Home Jersey',
      description: 'Classic red devil jersey with moisture-wicking fabric',
      price: 84.99,
      imageUrl: 'https://www.eurosportsoccer.com/cdn/shop/products/manchesterunitedronaldojersey_900x.png?v=1670548383',
      category: 'Clothing',
      stock: 25,
      rating: 4.7,
      metadata: ['Size: S, M, L, XL', 'Season: 2024']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174017',
      name: 'Colombian National Team Jersey',
      description: 'World Cup Champions jersey with three stars',
      price: 79.99,
      imageUrl: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/97e68f41d2f447b0b4eeb7006364c0cf_faec/Camiseta_Local_Seleccion_Colombia_26_Amarillo_JL6972_db01_laydown.tiff.jpg',
      category: 'Clothing',
      stock: 35,
      rating: 4.9,
      metadata: ['Size: S, M, L, XL', 'Stars: 3']
    },
    // Más productos variados
    {
      id: '123e4567-e89b-12d3-a456-426614174019',
      name: 'MacBook Air M2',
      description: '13.6-inch Liquid Retina display, 8GB RAM, 256GB SSD',
      price: 1099.99,
      imageUrl: 'https://co.tiendasishop.com/cdn/shop/files/IMG-5577525_10609475-a7af-40ef-8a28-d8aca2d5f015.jpg?v=1740448280&width=823',
      category: 'Electronics',
      stock: 8,
      rating: 4.9,
      metadata: ['Chip: M2', 'Color: Midnight']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174020',
      name: 'Sony PlayStation 5',
      description: 'Next-gen gaming console with 825GB SSD',
      price: 499.99,
      imageUrl: 'https://playcenter.com.co/wp-content/uploads/2021/03/11.png',
      category: 'Electronics',
      stock: 5,
      rating: 4.8,
      metadata: ['Storage: 825GB', 'Edition: Standard']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174022',
      name: 'Nike Air Jordan 1',
      description: 'Classic basketball shoes with iconic design',
      price: 169.99,
      imageUrl: 'https://cdn-images.farfetch-contents.com/12/96/03/49/12960349_13486594_1000.jpg',
      category: 'Sports',
      stock: 18,
      rating: 4.8,
      metadata: ['Color: Black/Red', 'Size: 7-13']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174024',
      name: 'Nike Mercurial Soccer Cleats',
      description: 'Professional soccer cleats with grip technology',
      price: 139.99,
      imageUrl: 'https://www.nuevasfutbol.com/56-thickbox_default/nike-mercurial-superfly-v-fg-zapatillas-de-f%C3%BAtbol-rojo-amarillo.jpg',
      category: 'Sports',
      stock: 20,
      rating: 4.7,
      metadata: ['Surface: Firm Ground', 'Size: 7-12']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174026',
      name: 'Mechanical Keyboard RGB',
      description: 'Gaming keyboard with cherry switches and RGB lighting',
      price: 119.99,
      imageUrl: 'https://www.decogear.com/cdn/shop/files/DGMECHBRD100-3.webp?v=1762525920',
      category: 'Electronics',
      stock: 15,
      rating: 4.6,
      metadata: ['Switches: Cherry MX Red', 'Layout: Full-size']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174028',
      name: 'AirPods Pro (2nd Gen)',
      description: 'Active noise cancellation with spatial audio',
      price: 249.99,
      imageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
      category: 'Electronics',
      stock: 22,
      rating: 4.8,
      metadata: ['Noise Cancellation: Active', 'Battery: 30h']
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174029',
      name: 'Electric Toothbrush',
      description: 'Sonic toothbrush with 5 brushing modes and smart timer',
      price: 69.99,
      imageUrl: 'https://images.philips.com/is/image/philipsconsumer/661fef637e574f418983ac5f00b794a1?wid=700&hei=700&$pnglarge$',
      category: 'Home',
      stock: 30,
      rating: 4.7,
      metadata: ['Battery: 30 days', 'Modes: 5']
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
