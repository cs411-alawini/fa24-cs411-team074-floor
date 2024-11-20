// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home route
  { path: 'login', component: LoginComponent }, // Login route
  { path: '**', redirectTo: '' } // Wildcard route redirects to Home
];
