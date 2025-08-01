import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/auth';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductById(id: string): Observable<any> {
    return this.http.get<Product>(`http://localhost:8080/api/products/${id}`);
  }
  updateProductQuantity(productId: number, quantity: number) {
    return this.http.patch(`http://localhost:8080/api/products/${productId}`, {
      quantity,
    });
  }
}
