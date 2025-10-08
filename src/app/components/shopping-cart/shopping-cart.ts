import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

type CartItem = {
  id: number;
  title: string;
  price: number;   // unit price
  qty: number;
  img: string;
  meta?: string[]; // chips como "Color: Black"
  fav?: boolean;
};

@Component({
  selector: 'app-shopping-cart',
  standalone: true,                           // <-- clave para usar "imports"
  imports: [CommonModule, DecimalPipe],       // <-- trae *ngIf, *ngFor y pipes
  templateUrl: './shopping-cart.html',
  styleUrls: ['./shopping-cart.css']
})
export class ShoppingCartComponent {
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

  shipping = 0;     // FREE
  taxRate  = 0.08;  // 8%

  get subtotal(): number { return this.items.reduce((s, i) => s + i.price * i.qty, 0); }
  get taxes(): number    { return +(this.subtotal * this.taxRate).toFixed(2); }
  get total(): number    { return +(this.subtotal + this.shipping + this.taxes).toFixed(2); }

  inc(item: CartItem){ item.qty++; this.pulse(item.id); }
  dec(item: CartItem){ if (item.qty > 1) { item.qty--; this.pulse(item.id); } }
  remove(item: CartItem){ this.items = this.items.filter(i => i.id !== item.id); }
  clear(){ this.items = []; }
  toggleFav(item: CartItem){ item.fav = !item.fav; }

  // Para *ngFor performance
  trackById = (_: number, it: CartItem) => it.id;

  // anima el chip de cantidad
  private pulse(id: number){
    const el = document.querySelector<HTMLDivElement>(`#qty-${id}`);
    if (!el) return;
    el.classList.remove('scale-in');
    void el.offsetWidth;            // reflow
    el.classList.add('scale-in');
  }

  secureCheckout(){ alert('🔒 Secure checkout demo'); }
}
