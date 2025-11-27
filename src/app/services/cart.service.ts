import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ShoppingCart, CartItem, CheckoutResponse } from '../models/cart.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/cart`;
  
  // Estado reactivo del carrito (para sincronizar entre componentes)
  private cartSubject = new BehaviorSubject<ShoppingCart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    // Solo cargar el carrito si hay un token válido
    if (this.authService.isAuthenticated() && !this.authService.isTokenExpired()) {
      this.loadCart();
    }
  }

  /**
   * Obtiene el carrito actual del usuario
   * Keycloak manejará la autenticación a través del gateway/proxy
   */
  getCart(): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>(this.apiUrl).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(err => {
        // Si falla, inicializar carrito vacío
        const emptyCart: ShoppingCart = {
          userId: '',
          items: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0
        };
        this.cartSubject.next(emptyCart);
        return this.handleError(err);
      })
    );
  }

  /**
   * Carga el carrito (usado internamente)
   */
  private loadCart(): void {
    this.getCart().subscribe({
      next: (cart) => console.log('Carrito cargado:', cart),
      error: (err) => console.error('Error cargando carrito:', err)
    });
  }

  /**
   * Agrega un producto al carrito
   */
  addItem(productId: string): Observable<ShoppingCart> {
    const params = new HttpParams().set('productId', productId);
    
    return this.http.post<ShoppingCart>(`${this.apiUrl}/items`, null, { params }).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza la cantidad de un producto en el carrito
   */
  updateItemQuantity(productId: string, quantity: number): Observable<ShoppingCart> {
    const params = new HttpParams()
      .set('productId', productId)
      .set('quantity', quantity.toString());
    
    return this.http.put<ShoppingCart>(`${this.apiUrl}/items`, null, { params }).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(this.handleError)
    );
  }

  /**
   * Elimina un producto del carrito
   */
  removeItem(productId: string): Observable<ShoppingCart> {
    const params = new HttpParams().set('productId', productId);
    
    return this.http.delete<ShoppingCart>(`${this.apiUrl}/items`, { params }).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(this.handleError)
    );
  }

  /**
   * Realiza el checkout del carrito
   */
  checkout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/checkout`, null).pipe(
      tap(() => {
        // Limpiar el carrito local después del checkout exitoso
        this.cartSubject.next(null);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene el conteo de items en el carrito (útil para el badge del header)
   */
  getItemCount(): Observable<number> {
    return this.cart$.pipe(
      map(cart => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + item.quantity, 0);
      })
    );
  }

  /**
   * Manejo centralizado de errores HTTP
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';
    
    // Verificar si es un error del lado del cliente (solo en browser)
    if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
      
      // Mensajes específicos según el código de estado
      switch (error.status) {
        case 401:
          errorMessage = 'No estás autenticado. Por favor inicia sesión.';
          break;
        case 403:
          errorMessage = 'No tienes permisos para realizar esta acción.';
          break;
        case 404:
          errorMessage = 'El recurso solicitado no fue encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intenta más tarde.';
          break;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
