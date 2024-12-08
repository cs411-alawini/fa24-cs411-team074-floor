import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [HttpClientModule, RouterModule, CommonModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  skins: Array<{ SkinID: string; Image: string; Description: string }> = [];
  cart: Array<{ SkinID: string; Image: string; Description: string }> = [];

  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private router: Router,
    private location: Location,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchSkins();
  }

  fetchSkins(): void {
    this.apiService.getSkins().subscribe(
      (response) => {
        this.skins = response.result.map(
          ([SkinID, Image, Description]: [string, string, string]) => ({
            SkinID: SkinID,
            Image: Image,
            Description: Description,
          })
        );
      },
      (error) => {
        console.error('Error fetching skins:', error);
      }
    );
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

  addToCart(skin: {
    SkinID: string;
    Image: string;
    Description: string;
  }): void {
    //console.log('Add to Cart Clicked:', skin);
    if (!this.cart.some((item) => item.SkinID === skin.SkinID)) {
      this.cart.push(skin);
      //console.log('Cart Updated:', this.cart);
    }
  }

  removeFromCart(skin: {
    SkinID: string;
    Image: string;
    Description: string;
  }): void {
    this.cart = this.cart.filter((item) => item.SkinID !== skin.SkinID);
    //console.log('Cart Updated:', this.cart);
  }

  isInCart(skinID: string): boolean {
    return this.cart.some((item) => item.SkinID === skinID);
  }
}
