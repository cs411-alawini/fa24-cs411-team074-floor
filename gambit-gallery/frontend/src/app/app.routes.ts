// src/app/app.routes.ts
//file that defines all the routes based on which buttons
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DataPageComponent } from './data-page/data-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home route
  { path: 'login', component: LoginComponent }, // Login route
  { path: 'data-page', component: DataPageComponent},
  { path: '**', redirectTo: '' } // Wildcard route redirects to Home
];
