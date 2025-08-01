import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Auth } from '../../models/auth';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    ReactiveFormsModule,
    NgIf,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  userForm!: FormGroup;
  loading = true;
  user: Auth | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, noWhitespaceValidator()]],
      lastName: ['', [Validators.required, noWhitespaceValidator()]],

      phoneNum: [
        '',
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.pattern(/^\d{10}$/), // Only digits and exactly 10
        ],
      ],
      userRole: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      status: [{ value: '', disabled: true }],
    });

    const currentUser = this.authService.getCurrentUser();
    const userId = currentUser?.id;

    if (!userId) {
      console.error('User ID not found.');
      this.loading = false;
      return;
    }

    this.authService.getIdOfUser(userId).subscribe({
      next: (userData: Auth) => {
        this.user = userData;
        this.loading = false;
        this.populateForm(userData);
      },
      error: (err: any) => {
        console.error('Error fetching user:', err);
        this.loading = false;
      },
    });
  }

  populateForm(userData: Auth) {
    this.userForm.patchValue({
      firstName: userData.firstName,
      lastName: userData.lastName,
      userRole: userData.userRole,
      email: userData.email,
      phoneNum: userData.phoneNum,
      status: userData.status,
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid || !this.user || !this.user.id) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.getRawValue();
    formValue.firstName = formValue.firstName.trim();
    formValue.lastName = formValue.lastName.trim();
    formValue.phoneNum = formValue.phoneNum.trim();

    // Prepare updated user data including disabled fields by using getRawValue()
    // const updatedUser = { ...this.user, ...this.userForm.getRawValue() };
    // const updatedUser = { ...this.user, ...formValue };
    const updatedUser = {
      id: this.user.id,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phoneNum: formValue.phoneNum,
      email: this.user.email,
      userRole: this.user.userRole,
      status: this.user.status,
    };

    this.authService.updateUser(this.user.id, updatedUser).subscribe({
      next: (res) => {
        this.user = res;
        this.messageService.add({
          severity: 'success',
          summary: 'Profile Updated',
          detail: 'Your profile has been updated successfully!',
        });
        sessionStorage.setItem('role', res.userRole?.toUpperCase() || '');
        console.log('✅ User updated successfully');
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Occurred',
          detail: 'Error occurred while updating your profile!',
        });
        console.error('❌ Failed to update user:', err);
      },
    });
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
