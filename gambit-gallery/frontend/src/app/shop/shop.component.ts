import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { Location, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../cart.service';
import { FormsModule } from '@angular/forms'; // <-- Add this import

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [HttpClientModule, RouterModule, CommonModule, FormsModule], // <-- Add FormsModule here
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'] // <-- Make sure it's styleUrls (plural)
})
export class ShopComponent implements OnInit {
    skins: Array<{ SkinID: string; Image: string; Description: string }> = []; 
    cart: Array<{ SkinID: string; Image: string; Description: string }> = [];
    searchTerm: string = ''; // <-- Add this property for the search term

    constructor(
      private cartService: CartService, 
      private router: Router, 
      private location: Location, 
      private http: HttpClient
    ) {}

    ngOnInit(): void {
      this.fetchSkins();
    }

    fetchSkins(): void {
        this.skins = [
            {SkinID: "s0", Image: "bruh", Description: "abc"},
            {SkinID: "s1", Image: "bruh", Description: "bcd"},
            {SkinID: "s2", Image: "bruh", Description: "cde"},
            {SkinID: "s3", Image: "bruh", Description: "def"},
            {SkinID: "s4", Image: "bruh", Description: "efg"},
        ];
    }

    filteredSkins(): Array<{ SkinID: string; Image: string; Description: string }> {
      if (!this.searchTerm) {
        return this.skins;
      }
      const lowerTerm = this.searchTerm.toLowerCase();
      return this.skins.filter(skin => 
        skin.Description.toLowerCase().includes(lowerTerm)
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

    addToCart(skin: { SkinID: string; Image: string; Description: string }): void {
      if (!this.cart.some((item) => item.SkinID === skin.SkinID)) {
        this.cart.push(skin);
      }
    }

    removeFromCart(skin: { SkinID: string; Image: string; Description: string }): void {
      this.cart = this.cart.filter((item) => item.SkinID !== skin.SkinID);
    }

    isInCart(skinID: string): boolean {
      return this.cart.some((item) => item.SkinID === skinID);
    }
}
