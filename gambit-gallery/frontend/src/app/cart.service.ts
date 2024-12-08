import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject: any[] = [];

  setCart(cart: any[]) {
    this.cartSubject = cart;
  }

  getCart() {
    return this.cartSubject;
  }
}