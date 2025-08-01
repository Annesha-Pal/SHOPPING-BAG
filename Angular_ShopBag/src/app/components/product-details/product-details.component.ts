import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { Product } from '../../models/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
// import { OrderComponent } from '../order/order.component';
import { NgIf } from '@angular/common';
import { OrderService } from '../../services/order.service';
// import { CartComponent } from '../cart/cart.component';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    InputNumberModule,
    // OrderComponent,
    FormsModule,
    ButtonModule,
    ToastModule,
    NgIf,
    // CartComponent,
  ],
  providers: [MessageService],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  Orders: any[] = [];
  quantity: number = 1;
  // cartService: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService // private cartService: CartService
  ) {}
  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.getProductDetails(productId);
    }
  }
  getProductDetails(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        console.log('Product loaded:', data);
      },
      error: (err) => {
        console.error('Error fetching product', err);
      },
    });
  }

  increaseQuantity() {
    // this.quantity++;
    this.orderService.addToCart(this.product);
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    if (this.product?.id != null) {
      const cartKey = `Item number ${this.product.id}`;
      localStorage.setItem(cartKey, this.quantity.toString());
      console.log(
        `Product in the cart: ${cartKey}, quantity: ${this.quantity}`
      );
    } else {
      console.warn('Product ID not available. Cannot save to localStorage.');
    }
  }

  onQuantityChange() {
    if (this.product) {
      const totalPrice = this.quantity * this.product.price;
      console.log('Total Price:', totalPrice);
    }
  }

  getSelectedTotal(): number {
    return this.Orders.filter((order) => order.selected).reduce(
      (acc, order) => acc + order.quantity * order.product.price,
      0
    );
  }

  buyNow() {
    if (!this.product || !this.product.id) return;

    const userId = this.authService.getUserId();
    if (!userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'User not logged in',
        detail: 'Please log in to place an order.',
      });
      return;
    }

    if (this.quantity > this.product.quantity) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Insufficient Stock',
        detail: `Only ${this.product.quantity} items available.`,
      });
      return;
    }

    const orderPayload = {
      user: { id: userId },
      product: { id: this.product.id },
      quantity: this.quantity,
      totalPrice: this.quantity * this.product.price,
    };

    this.orderService.addToCart(orderPayload).subscribe({
      next: (orderResponse) => {
        // Now update product quantity in DB
        const updatedQuantity = this.product!.quantity - this.quantity;

        this.productService
          .updateProductQuantity(this.product!.id, updatedQuantity)
          .subscribe({
            next: (response) => {
              console.log('Patch quantity response:', response);
              this.messageService.add({
                severity: 'success',
                summary: 'Order Placed',
                detail: 'Your order has been placed successfully!',
              });
              setTimeout(() => {
                this.router.navigate(['/order'], {
                  state: { orderId: orderResponse.id },
                });
              }, 2000);
            },
            error: (err) => {
              console.error('Error updating product quantity:', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Stock Update Failed',
                detail: 'Order was placed, but stock not updated.',
              });
            },
          });
      },
      error: (err) => {
        console.error('Error placing order:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Order Failed',
          detail: 'Could not place your order.',
        });
      },
    });
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
