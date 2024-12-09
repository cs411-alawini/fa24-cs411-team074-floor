import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [HttpClientModule, RouterModule, CommonModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  skins: Array<{ SkinID: string; Image: string; Description: string }> = [];
  cart: Array<{ SkinID: string; Image: string; Description: string }> = [];
  searchQuery: string = '';
  filteredSkins: Array<{ SkinID: string; Image: string; Description: string }> =
    [];

  constructor(
    private cartService: CartService,
    private router: Router,
    private location: Location,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchSkins();
  }

  onSearch() {
    console.log('Searching for:', this.searchQuery);
    if (this.searchQuery.trim() === '') {
      // If search query is empty, show all skins
      console.log('Nothing has been typed');
      this.filteredSkins = [...this.skins];
    } else {
      // Filter skins based on the search query
      this.filteredSkins = this.skins.filter((skin) =>
        skin.Description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // If no matches are found, show all skins
    if (this.filteredSkins.length === 0) {
      console.log('No matches found. Showing all skins.');
      this.filteredSkins = [...this.skins];
    }
  }

  fetchSkins(): void {
    this.http.get<any>('http://127.0.0.1:5000/api/get_skins').subscribe(
      (response) => {
        this.skins = response.result.map(
          ([SkinID, Image, Description]: [string, string, string]) => ({
            SkinID: SkinID,
            Image: Image,
            Description: Description,
          })
        );
        console.log(this.skins); //CHECK WHAT SKINS ARE HERE CURRENTLY
        this.filteredSkins = [...this.skins];
        console.log(this.filteredSkins); //CHECK WHAT SKINS ARE HERE CURRENTLY
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
