import { Routes } from '@angular/router';
import { CatalogComponent } from './components/catalog/catalog';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart';
import { CheckoutComponent } from './components/checkout/checkout';

export const routes: Routes = [
  { path: '', component: CatalogComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'cart', component: ShoppingCartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**', redirectTo: '' }
];
