import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
} from '@angular/forms';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../../layout/footer/footer.component';
import { TagModule } from 'primeng/tag';
// import { EncryptionService } from '../../services/encryption.service';
import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../layout/header/header.component';
import { AuthService } from '../../services/auth.service';
import { OnInit } from '@angular/core';
import { Product } from '../../models/auth';
// import { Product } from '../../interfaces/auth';
// import { NgFor } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FooterComponent,
    ButtonModule,
    RouterModule,
    ProductDetailsComponent,
    CardModule,
    ReactiveFormsModule,
    CascadeSelectModule,
    CommonModule,
    InputTextModule,
    FormsModule,
    AccordionModule,
    CarouselModule,
    TagModule,
    HeaderComponent,
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private fb: FormBuilder,
    // private encryptionService: EncryptionService,
    private messageService: MessageService
  ) {}

  searchText: string = '';

  onSearch() {
    console.log('Searching for:', this.searchText);
  }
  eCom: any[] | undefined;

  selectedProduct: any;
  allProducts: any[] = [];
  formGroup!: FormGroup;
  responsiveOptions: any[] | undefined;
  products: Product[] = [];
  visibleProducts: any[] = [];
  showAll: boolean = false;
  mobileBatchSize = 5;
  generalProducts: any[] = [];
  visibleGeneralProducts: any[] = [];
  showAllMobile = false;
  mobileAccessoryProducts: any[] = [];
  visibleMobileAccessories: any[] = [];

  plainText: string = '';
  encryptedText: string = '';
  decryptedText: string = '';
  getSplashImage(index: number): string {
    const splashImages = [
      'https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2l0Y2hlbnxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1636115305669-9096bffe87fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FkZ2V0c3xlbnwwfHwwfHx8MA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1684407616442-8d5a1b7c978e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFrZXVwfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1543168256-418811576931?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGdyb2Nlcnl8ZW58MHx8MHx8fDA%3D',
      'https://plus.unsplash.com/premium_photo-1681276170683-706111cf496e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWNjZXNzb3JpZXN8ZW58MHx8MHx8fDA%3D',

      'https://images.unsplash.com/photo-1559563458-527698bf5295?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJhZ3N8ZW58MHx8MHx8fDA%3D',

      'https://plus.unsplash.com/premium_photo-1683133958062-12afa652a4fb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG9tZSUyMGRlY29yfGVufDB8fDB8fHww',
      'https://plus.unsplash.com/premium_photo-1682435561654-20d84cef00eb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2hvZXN8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGhvbmVzfGVufDB8fDB8fHww',
    ];

    // cycle through the images if more products than images
    return splashImages[index % splashImages.length];
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      selectedProduct: new FormControl(null),
      Options: new FormControl(''),
    });

    this.loadVisibleProducts();
    this.loadGeneralProducts();
    // this.loadMobileAccessories();

    this.http
      .get<any>('http://localhost:8080/api/products?limit=15')
      .subscribe((res) => {
        this.products = res.map((product: any, index: number) => ({
          ...product,
          image: this.getSplashImage(index),
        }));
        this.visibleProducts = this.products.slice(0, 5);
      });

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  onShowMore() {
    this.showAll = true;
    this.visibleProducts = this.products;
  }
  onShopMore() {
    window.scrollTo({ top: 800, behavior: 'smooth' });
    this.router.navigate(['/home']);
  }

  loadVisibleProducts() {
    this.http
      .get<any>('http://localhost:8080/api/products?limit=5')
      .subscribe((res) => {
        this.visibleProducts = res.products;
      });
  }

  loadGeneralProducts() {
    this.http
      .get<any>('http://localhost:8080/api/products?limit=5')
      .subscribe((res) => {
        this.generalProducts = res.products;
        this.visibleGeneralProducts = this.generalProducts.slice(0, 5);
      });
  }
  viewProductDetails(product: Product): void {
    // const encryptedId = this.encryptionService.encrypt(product.id.toString());
    this.router.navigate(['/product-details', product.id]);
  }
}
