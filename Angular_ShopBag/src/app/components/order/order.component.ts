import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Auth, Order } from '../../models/auth';
import { HeaderComponent } from '../../layout/header/header.component';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../layout/footer/footer.component';
import { Router } from '@angular/router';
@Component({
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, ButtonModule],
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService, private router: Router) {}
  ngOnInit(): void {
    const storedUser = localStorage.getItem('_login'); // ✅ correct key

    if (!storedUser) {
      console.error('No user found in localStorage under _login');
      return;
    }
    const user = JSON.parse(storedUser);
    const userId = user?.id;
    console.log('Logged-in User ID:', userId);
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    this.orderService.getOrderByUser(userId).subscribe(
      (orders: Order[]) => {
        console.log('Orders from backend:', orders);
        this.orders = orders;
        console.log('Orders:', this.orders);
      },
      (error) => {
        console.error('Failed to fetch orders', error);
      }
    );
  }
  goHome() {
    this.router.navigate(['/home']);
  }
}
