import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../cart.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-complete-shop-purchase',
  standalone: true,
  imports: [HttpClientModule, RouterModule, CommonModule],
  templateUrl: './complete-shop-purchase.component.html',
  styleUrls: ['./complete-shop-purchase.component.css'],
})
export class CompleteShopPurchaseComponent implements OnInit {
  cart: any[] = [];

  constructor(
    private api: ApiService,
    private userService: UserService,
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.cart = this.cartService.getCart();
  }

  goBack(): void {
    this.location.back();
  }

  completePurchase() {
    let items = '';
    this.cart.forEach((c) => {
      items += ' ' + c.Description;
    });
    this.api.sendFunds(
      this.userService.getUsername(),
      'SHOP',
      this.cart.length,
      'Purchased: ' + items
    );
    this.router.navigate(['/home']);
  }
}
