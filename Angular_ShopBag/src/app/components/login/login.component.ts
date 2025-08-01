import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { MessagesModule } from 'primeng/messages';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    HeaderComponent,
    FooterComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    CommonModule,
    MessagesModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  errorMsg: string = '';

  constructor(
    private user: UserService,
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.errorMsg = 'Please fill in all required fields.';
      return;
    }

    const loginData = {
      email: this.email!.value!,
      password: this.password!.value!,
    };

    this.authService.loginUser(loginData).subscribe({
      next: (response: any) => {
        console.log('Login successful!', response);
        // alert(`Welcome! Token: ${response.token}`);
        const user = response;

        if (user && user.firstName) {
          localStorage.setItem('loginData', JSON.stringify(loginData));
          localStorage.setItem('_login', JSON.stringify(response));
          // localStorage.setItem('_login', response);
          localStorage.setItem('user', JSON.stringify(user));
          sessionStorage.setItem('firstName', user.firstName);
          sessionStorage.setItem('email', user.email);
          localStorage.setItem('userId', user.id);
          sessionStorage.setItem('role', user.userRole.toUpperCase());
          this.user.login(user.firstName);
          this.messageService.add({
            severity: 'success',
            summary: 'Login Successful',
            detail: 'Your login has been successful!',
          });
        }
        setTimeout(() => this.router.navigate(['/home']), 1000);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMsg = 'Invalid email or password.';
        alert(this.errorMsg);
      },
    });
  }
  onBack() {
    this.router.navigate(['/home']);
  }
}
