import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { Location, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../cart.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [HttpClientModule, RouterModule,CommonModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit{
    skins: any[] = []; 
    cart: any[] = [];

    errorMessage: string = '';

    constructor(private apiService: ApiService, private cartService: CartService, private router: Router, private location: Location, private http: HttpClient) {}

    ngOnInit(): void {
      this.apiService.getSkins().subscribe((data) => {
        this.skins = data.result.map(
          ([SkinID, Image, Description]: [string, string, string]) => ({
            SkinID,
            Image,
            Description
          })
        );
      });
    }

    goBack(): void {
      this.location.back();
    }

    checkout() {
      if (this.cart.length > 0) {
        this.cartService.setCart(this.cart);
        this.router.navigate(['/complete-shop-purchase']);
      }
    }

    addToCart(skin: any): void {
      if (!this.isInCart(skin.SkinID)) {
        this.cart.push(skin);
      }
    }

    removeFromCart(skin: any): void {
      this.cart = this.cart.filter(item => item.SkinID !== skin.SkinID);
    }

    isInCart(skin: any): boolean {
      return this.cart.some(item => item.SkinID === skin.SkinID);
    }
}