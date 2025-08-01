import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { passwordMatchValidator } from '../../shared/password-match.directive';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CardModule,
    FormsModule,
    NgIf,
    ToastModule,
    ButtonModule,
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  submitting = false;
  registerForm = this.fb.group(
    {
      fullName: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/)],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm),
        ],
      ],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phoneNum: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\+?\d{10,15}$/), // Adjust pattern to match your requirements
        ],
      ],
    },
    {
      validators: passwordMatchValidator,
    }
  );

  constructor(
    private messageService: MessageService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {}

  get fullName() {
    return this.registerForm.controls['fullName'];
  }
  get email() {
    return this.registerForm.controls['email'];
  }
  get password() {
    return this.registerForm.controls['password'];
  }
  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }
  get phoneNum() {
    return this.registerForm.controls['phoneNum'];
  }

  onRegister() {
    if (this.registerForm.invalid || this.submitting) {
      return;
    }
    const formData = this.registerForm.value;
    const nameParts = formData.fullName!.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'User';
    const email = formData.email!.split('@')[0];
    const phoneNum = formData.phoneNum!.replace(/\D/g, '');
    const postData = {
      firstName: firstName,
      lastName: lastName,
      email: formData.email,
      password: formData.password,
      phoneNum: formData.phoneNum,
    };
    this.submitting = true;
    this.http.post('http://localhost:8080/api/users', postData).subscribe({
      next: (response) => {
        //  localStorage.setItem('loginData', JSON.stringify(loginData));
        localStorage.setItem('_login', JSON.stringify(response));
        // localStorage.setItem('_login', response);
        sessionStorage.setItem('firstName', firstName);
        sessionStorage.setItem('email', email);
        localStorage.setItem('user', JSON.stringify(response));
        console.log('Registration successful', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Registration Successful!',
          detail: 'Your registration have been successfully!',
        });
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Something occurred',
          detail: 'Error occurred while registering!',
        });
      },
    });
  }
  onBack() {
    this.router.navigate(['/home']);
  }
}
