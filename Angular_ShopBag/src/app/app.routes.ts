import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/login/login.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { OrderComponent } from './components/order/order.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { HomeComponent } from './components/home/home.component';
export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'product-details/:id',
    component: ProductDetailsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'order',
    component: OrderComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },

  {
    path: 'user-details/:id',
    component: UserDetailsComponent,
    canActivate: [adminGuard],
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
