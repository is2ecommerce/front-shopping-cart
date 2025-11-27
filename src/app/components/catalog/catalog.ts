import { Component, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule],
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.css']
})
export class CatalogComponent implements OnInit {
  // Signals
  isDarkTheme = signal(false);
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  isLoading = signal(true);
  selectedCategory = signal<string>('all');
  searchTerm = signal('');
  categories = signal<string[]>([]);
  
  // Cart item count
  cartItemCount = signal(0);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Capturar token de la URL si viene desde el login
    this.route.queryParams.subscribe(params => {
      if (params['access_token']) {
        this.authService.setToken(params['access_token']);
        if (params['refresh_token']) {
          this.authService.setRefreshToken(params['refresh_token']);
        }
        // Limpiar la URL
        this.router.navigate([], {
          queryParams: {},
          replaceUrl: true
        });
      }
    });

    this.loadProducts();
    this.loadCategories();
    this.updateCartCount();
  }

  /**
   * Carga todos los productos
   */
  loadProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.filteredProducts.set(products);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Carga las categorías disponibles
   */
  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      }
    });
  }

  /**
   * Filtra productos por categoría
   */
  filterByCategory(category: string) {
    this.selectedCategory.set(category);
    this.applyFilters();
  }

  /**
   * Busca productos por término
   */
  onSearch() {
    this.applyFilters();
  }

  /**
   * Aplica todos los filtros activos
   */
  private applyFilters() {
    let filtered = this.products();

    // Filtro por categoría
    if (this.selectedCategory() !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory());
    }

    // Filtro por búsqueda
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    this.filteredProducts.set(filtered);
  }

  /**
   * Agrega un producto al carrito
   */
  addToCart(product: Product) {
    this.cartService.addItem(product.id).subscribe({
      next: () => {
        this.updateCartCount();
        this.showNotification(`${product.name} agregado al carrito`);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.showNotification('Error al agregar producto', 'error');
      }
    });
  }

  /**
   * Actualiza el contador del carrito
   */
  private updateCartCount() {
    this.cartService.getItemCount().subscribe({
      next: (count) => this.cartItemCount.set(count)
    });
  }

  /**
   * Navega al carrito
   */
  goToCart() {
    this.router.navigate(['/cart']);
  }

  /**
   * Alterna entre tema claro y oscuro
   */
  toggleTheme() {
    this.isDarkTheme.update(value => !value);
    if (isPlatformBrowser(this.platformId)) {
      const appBg = document.querySelector('.app-bg');
      if (appBg) {
        if (this.isDarkTheme()) {
          appBg.classList.remove('theme-light');
          appBg.classList.add('theme-dark');
        } else {
          appBg.classList.remove('theme-dark');
          appBg.classList.add('theme-light');
        }
      }
    }
  }

  /**
   * Muestra una notificación temporal
   */
  private showNotification(message: string, type: 'success' | 'error' = 'success') {
    if (isPlatformBrowser(this.platformId)) {
      // Aquí podrías integrar un sistema de notificaciones
      // Por ahora, simplemente log
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  /**
   * Para *ngFor performance
   */
  trackById = (_: number, product: Product) => product.id;
}
