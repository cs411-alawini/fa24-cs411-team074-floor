import { Component, OnInit } from '@angular/core';
import { RouterModule, Router  } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-complete-shop-purchase',
  standalone: true,
  imports: [HttpClientModule, RouterModule,CommonModule],
  templateUrl: './complete-shop-purchase.component.html',
  styleUrls: ['./complete-shop-purchase.component.css']
})
export class CompleteShopPurchaseComponent implements OnInit{
  cart: any[] = [];

  constructor(private router: Router, private location: Location, private http: HttpClient, private cartService: CartService) {}

  ngOnInit() {
    this.cart = this.cartService.getCart();
  }

  goBack(): void {
    this.location.back();
  }

  completePurchase() {
    this.router.navigate(['/home']);
  }

}