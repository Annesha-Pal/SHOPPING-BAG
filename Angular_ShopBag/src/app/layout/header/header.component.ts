import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CardModule,
    NgIf,
    CommonModule,
    MenuModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
  ],

  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = true;
  username: string = '';
  userMenu: MenuItem[] = [];
  firstName: string = '';

  private subscriptions = new Subscription();
  constructor(private router: Router, public user: UserService) {}

  ngOnInit() {
    this.user.checkSession();

    this.subscriptions.add(
      this.user.firstName$.subscribe((name) => (this.firstName = name ?? ''))
    );

    this.subscriptions.add(
      this.user.isLoggedIn$.subscribe((status) => (this.isLoggedIn = status))
    );

    this.userMenu = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['home']),
      },
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['profile']),
      },
      {
        label: 'Admin',
        icon: 'pi pi-chart-line',
        command: () => this.router.navigate(['admin']),
      },
      {
        label: 'Order',
        icon: 'pi pi-shopping-cart',
        command: () => this.router.navigate(['order']),
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.user.logout();
    this.router.navigate(['/']);
  }

  onLogin() {
    this.router.navigate(['login']);
  }

  onRegister() {
    this.router.navigate(['register']);
  }
}
