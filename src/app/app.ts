import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ShoppingCartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('shopping-cart');
}
