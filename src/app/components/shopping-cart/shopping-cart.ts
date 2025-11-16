import { Component, signal, effect, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

type CartItem = {
  id: number;
  title: string;
  price: number;   // unit price
  qty: number;
  img: string;
  meta?: string[]; // chips como "Color: Black"
};

@Component({
  selector: 'app-shopping-cart',
  standalone: true,                           // <-- clave para usar "imports"
  imports: [CommonModule, DecimalPipe],       // <-- trae *ngIf, *ngFor y pipes
  templateUrl: './shopping-cart.html',
  styleUrls: ['./shopping-cart.css']
})
export class ShoppingCartComponent {
  // Signal para controlar el tema (false = claro, true = oscuro)
  isDarkTheme = signal(false);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
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
  
  items: CartItem[] = [
    {
      id: 1, title: 'Wireless Bluetooth Headphones', price: 89.99, qty: 1,
      img: 'https://co.tiendasishop.com/cdn/shop/files/IMG-14858589.jpg?v=1726245557',
      meta: ['Version: Pro 2']
    },
    {
      id: 2, title: 'Premium Cotton T-Shirt', price: 29.99, qty: 2,
      img: 'https://peopleplays.vtexassets.com/arquivos/ids/511458-800-auto?v=638731773540670000&width=800&height=auto&aspect=true',
      meta: ['Size: S', 'Color: Yellow and Green']
    },
    {
      id: 3, title: 'Leather Wallet', price: 49.99, qty: 1,
      img: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/a284c05789e64be281506dbda3204ed0_9366/Tenis_Ultraboost_5_Turquesa_JQ2911_HM1.jpg',
      meta: ['Color: Blue-Green']
    },
  ];

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

  inc(item: CartItem){ item.qty++; this.pulse(item.id); }
  dec(item: CartItem){ if (item.qty > 1) { item.qty--; this.pulse(item.id); } }
  remove(item: CartItem){ this.items = this.items.filter(i => i.id !== item.id); }
  clear(){ this.items = []; }

  // Para *ngFor performance
  trackById = (_: number, it: CartItem) => it.id;

  // Método para alternar entre tema claro y oscuro
  toggleTheme() {
    this.isDarkTheme.update(value => !value);
  }

  // anima el chip de cantidad
  private pulse(id: number){
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
