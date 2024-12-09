// src/app/app.routes.ts
//file that defines all the routes based on which buttons
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DataPageComponent } from './data-page/data-page.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ShopComponent } from './shop/shop.component';
import { PokerGameComponent } from './poker-game/poker-game.component';
import { RoomsPopupComponent } from './rooms-popup/rooms-popup.component';
import { CompleteShopPurchaseComponent } from './complete-shop-purchase/complete-shop-purchase.component';
import { ShowRoomsComponent } from './show-rooms/show-rooms.component'
import { CreateAccountComponent } from './create-account/create-account.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home route
  { path: 'login', component: LoginComponent }, // Login route
  { path: 'stats', component: DataPageComponent},
  { path: 'transactions', component: TransactionsComponent},
  { path: 'shop', component: ShopComponent},
  { path: 'complete-shop-purchase', component: CompleteShopPurchaseComponent},
  { path: 'rooms', component: RoomsPopupComponent},
  { path: 'poker-game/:roomCode', component:PokerGameComponent},
  { path: 'show-rooms', component: ShowRoomsComponent},
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' } // Wildcard route redirects to Home
];