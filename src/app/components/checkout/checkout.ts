import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type PaymentMethod = 'credit-card' | 'paypal' | 'debit-card';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  // Signals
  selectedPaymentMethod = signal<PaymentMethod>('credit-card');
  isProcessing = signal(false);
  showSuccess = signal(false);
  
  // Form data
  cardNumber = '';
  cardName = '';
  expiryDate = '';
  cvv = '';
  email = '';
  
  // Para generar número de orden aleatorio
  orderNumber = '';
  
  // Order summary (esto vendría del carrito en una app real)
  orderSummary = {
    subtotal: 199.96,
    shipping: 0,
    tax: 16.00,
    total: 215.96,
    itemCount: 3
  };

  constructor(private router: Router) {}

  ngOnInit() {
    // Aquí podrías cargar los datos del carrito desde un servicio
    this.orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  selectPaymentMethod(method: PaymentMethod) {
    this.selectedPaymentMethod.set(method);
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.cardNumber = formattedValue.substring(0, 19); // Max 16 digits + 3 spaces
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.expiryDate = value;
  }

  processPayment() {
    // Validación básica
    if (!this.validateForm()) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    this.isProcessing.set(true);

    // Simular procesamiento de pago
    setTimeout(() => {
      this.isProcessing.set(false);
      this.showSuccess.set(true);
      
      // Redirigir al carrito después de 3 segundos
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    }, 2000);
  }

  validateForm(): boolean {
    if (this.selectedPaymentMethod() === 'credit-card' || this.selectedPaymentMethod() === 'debit-card') {
      return !!(
        this.cardNumber.replace(/\s/g, '').length === 16 &&
        this.cardName.trim().length > 0 &&
        this.expiryDate.length === 5 &&
        this.cvv.length >= 3 &&
        this.email.includes('@')
      );
    } else if (this.selectedPaymentMethod() === 'paypal') {
      return this.email.includes('@');
    }
    return false;
  }

  cancelCheckout() {
    if (confirm('¿Seguro que deseas cancelar el proceso de pago?')) {
      this.router.navigate(['/']);
    }
  }
}
