import { Component, signal, effect, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ShoppingCart, CartItem as ApiCartItem } from '../../models/cart.model';

// Tipo local para la UI (mapea con ApiCartItem del backend)
type CartItem = {
  id: string;       // productId del backend (UUID)
  title: string;
  price: number;    // unit price
  qty: number;      // quantity
  img: string;
  meta?: string[];  // chips como "Color: Black"
};

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './shopping-cart.html',
  styleUrls: ['./shopping-cart.css']
})
export class ShoppingCartComponent implements OnInit {
  // Signal para controlar el tema (false = claro, true = oscuro)
  isDarkTheme = signal(false);
  
  // Estado de carga
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private cartService: CartService
  ) {
    // Effect para sincronizar el tema con el wrapper principal de la app
    // Solo se ejecuta en el navegador, no en SSR
    effect(() => {
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
    });
  }
  
  ngOnInit() {
    // Cargar el carrito desde el backend
    this.loadCart();
  }
  
  /**
   * Carga el carrito desde el backend
   */
  loadCart() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    this.cartService.getCart().subscribe({
      next: (cart) => {
        // Mapear items del backend al formato de la UI
        this.items = cart.items?.map(item => ({
          id: item.productId,
          title: item.name || 'Producto',
          price: item.price,
          qty: item.quantity,
          img: item.imageUrl || 'https://via.placeholder.com/150',
          meta: item.metadata || []
        })) || [];
        
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando carrito:', error);
        this.errorMessage.set('No se pudo cargar el carrito. Mostrando datos de ejemplo.');
        this.isLoading.set(false);
        // Mantener datos mock si falla la conexión
        this.loadMockData();
      }
    });
  }
  
  /**
   * Carga datos mock para desarrollo/demo
   */
  private loadMockData() {
    this.items = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Wireless Bluetooth Headphones',
        price: 89.99,
        qty: 1,
        img: 'https://co.tiendasishop.com/cdn/shop/files/IMG-14858589.jpg?v=1726245557',
        meta: ['Version: Pro 2']
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Premium Cotton T-Shirt',
        price: 29.99,
        qty: 2,
        img: 'https://peopleplays.vtexassets.com/arquivos/ids/511458-800-auto?v=638731773540670000&width=800&height=auto&aspect=true',
        meta: ['Size: S', 'Color: Yellow and Green']
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174002',
        title: 'Leather Wallet',
        price: 49.99,
        qty: 1,
        img: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/a284c05789e64be281506dbda3204ed0_9366/Tenis_Ultraboost_5_Turquesa_JQ2911_HM1.jpg',
        meta: ['Color: Blue-Green']
      },
    ];
  }
  
  items: CartItem[] = [];

  shippingCost = 15;  // Costo de envío
  shipping = 15;      // Se actualiza dinámicamente
  taxRate  = 0.08;    // 8%
  
  // Umbral para envío gratis
  freeShippingThreshold = 250;

  get subtotal(): number { return this.items.reduce((s, i) => s + i.price * i.qty, 0); }
  get taxes(): number    { return +(this.subtotal * this.taxRate).toFixed(2); }
  get total(): number    { 
    // Actualizar shipping basado en si califica para envío gratis
    this.shipping = this.hasFreeShipping ? 0 : this.shippingCost;
    return +(this.subtotal + this.shipping + this.taxes).toFixed(2); 
  }
  
  // Métodos para la barra de progreso del envío gratis
  get freeShippingProgress(): number {
    const progress = (this.subtotal / this.freeShippingThreshold) * 100;
    return Math.min(progress, 100);
  }
  
  get amountForFreeShipping(): number {
    const remaining = this.freeShippingThreshold - this.subtotal;
    return Math.max(remaining, 0);
  }
  
  get hasFreeShipping(): boolean {
    return this.subtotal >= this.freeShippingThreshold;
  }

  inc(item: CartItem) {
    // Optimistic update
    const oldQty = item.qty;
    item.qty++;
    this.pulse(item.id);
    
    this.cartService.updateItemQuantity(item.id, item.qty).subscribe({
      next: (cart) => {
        // Confirmar con la respuesta del backend
        const updatedItem = cart.items?.find(i => i.productId === item.id);
        if (updatedItem) {
          item.qty = updatedItem.quantity;
        }
      },
      error: (error) => {
        // Revertir en caso de error
        item.qty = oldQty;
        console.error('Error incrementando cantidad:', error);
        this.errorMessage.set('Error al actualizar cantidad');
      }
    });
  }
  
  dec(item: CartItem) {
    if (item.qty > 1) {
      // Optimistic update
      const oldQty = item.qty;
      item.qty--;
      this.pulse(item.id);
      
      this.cartService.updateItemQuantity(item.id, item.qty).subscribe({
        next: (cart) => {
          // Confirmar con la respuesta del backend
          const updatedItem = cart.items?.find(i => i.productId === item.id);
          if (updatedItem) {
            item.qty = updatedItem.quantity;
          }
        },
        error: (error) => {
          // Revertir en caso de error
          item.qty = oldQty;
          console.error('Error decrementando cantidad:', error);
          this.errorMessage.set('Error al actualizar cantidad');
        }
      });
    }
  }
  
  remove(item: CartItem) {
    // Optimistic update
    const index = this.items.indexOf(item);
    const removedItem = this.items.splice(index, 1)[0];
    
    this.cartService.removeItem(item.id).subscribe({
      next: () => {
        // Eliminado exitosamente
      },
      error: (error) => {
        // Revertir en caso de error
        this.items.splice(index, 0, removedItem);
        console.error('Error eliminando item:', error);
        this.errorMessage.set('Error al eliminar producto');
      }
    });
  }
  
  clear() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      // Guardar referencia a los items
      const itemsToRemove = [...this.items];
      
      // Optimistic update - vaciar inmediatamente
      this.items = [];
      
      // Eliminar todos del backend
      const deleteRequests = itemsToRemove.map(item => 
        this.cartService.removeItem(item.id).toPromise()
      );
      
      Promise.all(deleteRequests)
        .then(() => {
          console.log('Carrito vaciado exitosamente');
        })
        .catch(error => {
          // Revertir si falla
          this.items = itemsToRemove;
          console.error('Error vaciando carrito:', error);
          this.errorMessage.set('Error al vaciar el carrito');
        });
    }
  }

  // Para *ngFor performance
  trackById = (_: number, it: CartItem) => it.id;

  // Método para alternar entre tema claro y oscuro
  toggleTheme() {
    this.isDarkTheme.update(value => !value);
  }

  // anima el chip de cantidad
  private pulse(id: string) {
    const el = document.querySelector<HTMLDivElement>(`#qty-${id}`);
    if (!el) return;
    el.classList.remove('scale-in');
    void el.offsetWidth;            // reflow
    el.classList.add('scale-in');
  }

  secureCheckout() { 
    // Navegar a la página de checkout
    this.router.navigate(['/checkout']);
  }
}
