// src/app/services/order.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getOrdersByUserId(orderId: number) {
    return this.http.get<any[]>(`http://localhost:8080/api/orders/${orderId}`);
  }

  getOrderByUser(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(
      `http://localhost:8080/api/orders/user/${userId}`
    );
  }

  addToCart(order: any): Observable<any> {
    return this.http.post('http://localhost:8080/api/orders', order);
  }

  updateOrder(orderId: number, updatedOrder: any): Observable<any> {
    return this.http.put(
      `http://localhost:8080/api/orders/${orderId}`,
      updatedOrder
    );
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/orders/${orderId}`, {
      responseType: 'text',
    });
  }
}
