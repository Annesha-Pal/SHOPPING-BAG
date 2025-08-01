import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './components/admin/admin.component';
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OrderComponent } from './components/order/order.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MessageService } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { Pipe, PipeTransform } from '@angular/core';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { ProductService } from './services/product.service';
import { CardModule } from 'primeng/card';
import { UserService } from './services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { PhoneFormatPipe } from './pipes/phone-format.pipe';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastModule,
    OrderComponent,
    InputNumberModule,
    FooterComponent,
    ButtonModule,
    UserDetailsComponent,
    NgIf,
    ProfileComponent,
    ProductDetailsComponent,
    CardModule,
    HomeComponent,
    HeaderComponent,
    PhoneFormatPipe,
    RouterModule,

    InputTextareaModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AdminComponent,
    HttpClientModule,
    LoginComponent,
    RegisterComponent,
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Angular_AdminTest';
}
