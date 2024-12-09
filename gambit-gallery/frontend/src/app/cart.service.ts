import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private transfer_cart_data: any[] = [];

  setCart(cart: any[]) {
    this.transfer_cart_data = cart;
  }

  getCart() {
    return this.transfer_cart_data;
  }
}