import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Auth } from '../../models/auth';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
// import { CustomerService } from '@service/customerservice';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { DropdownModule } from 'primeng/dropdown';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { TableModule } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { PhoneFormatPipe } from '../../pipes/phone-format.pipe';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
interface Status {
  name: string;
  code: string;
}
interface AdminSummary {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
}
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    FooterComponent,
    ChartModule,
    UserDetailsComponent,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    CommonModule,
    TableModule,
    TooltipModule,
    PhoneFormatPipe,
    HeaderComponent,
    DropdownModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  users: Auth[] = [];
  selectedUser: any = {};
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  loading: boolean = false;
  status: Status[] | undefined;
  user: any;
  formGroup: FormGroup | undefined;
  data: any;

  options: any;
  summary: AdminSummary = {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
  };

  // router: any;
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    (this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    }),
      (this.status = [
        { name: 'ACTIVE', code: 'active' },
        { name: 'INACTIVE', code: 'inactive' },
        { name: 'PENDING', code: 'pending' },
        { name: 'SUSPENDED', code: 'suspended' },
      ]);

    this.formGroup = this.fb.group({
      name: [''],
      selectedStatus: [null],
      // selectedStatus: new FormControl<Status | null>(null),
    });
    this.http.get<AdminSummary>('http://localhost:8080/api/admin').subscribe({
      next: (data) => (this.summary = data),
      error: (err) => console.error('Error fetching admin summary:', err),
    });
    this.loadUsers();
    this.getLoginStats();
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.authService.getUserById(id).subscribe((data) => {
      this.user = data;
    });
  }

  // // Load users from the backend
  loadUsers(firstName: string = '', status: string = '') {
    this.loading = true;

    const params: any = {};
    if (firstName) params.firstName = firstName;
    if (status) params.status = status;

    this.http.get<any[]>('http://localhost:8080/api/users').subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.loading = false;
      },
    });
  }
  onFilterSubmit(): void {
    const firstName = this.formGroup?.value.name?.trim().toLowerCase() || '';
    const status = this.formGroup?.value.selectedStatus?.code || '';

    this.http
      .get<Auth[]>('http://localhost:8080/api/users', {
        params: {
          ...(firstName && { firstName }),
          ...(status && { status }),
        },
      })
      .subscribe({
        next: (data) => {
          this.users = this.sortByRelevance(data, firstName);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.loading = false;
        },
      });
  }
  sortByRelevance(users: Auth[], keyword: string): Auth[] {
    if (!keyword) return users;

    return users.sort((a, b) => {
      const aName = a.firstName?.toLowerCase() || '';
      const bName = b.firstName?.toLowerCase() || '';

      if (aName === keyword && bName !== keyword) return -1;
      if (bName === keyword && aName !== keyword) return 1;

      if (aName.startsWith(keyword) && !bName.startsWith(keyword)) return -1;
      if (!aName.startsWith(keyword) && bName.startsWith(keyword)) return 1;

      const indexA = aName.indexOf(keyword);
      const indexB = bName.indexOf(keyword);
      return indexA - indexB;
    });
  }

  // Called when 'Delete' button is clicked
  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.loading = true;
      this.http
        .delete(`http://localhost:8080/api/users/${userId}`, {
          observe: 'response',
          responseType: 'text',
        })
        .subscribe({
          next: (response) => {
            if (response.status === 200) {
              this.loadUsers();
            }
            this.loading = false;
          },
          error: (err) => {
            console.error('Delete failed:', err);
            if (err.status === 409) {
              alert('Cannot delete user; related orders exist.');
            }
            this.loading = false;
          },
        });
    }
  }
  goToUser(id: string) {
    this.router.navigate(['/user-details', id]);
  }

  getLoginStats(): void {
    this.http
      .get<{ data: { [key: string]: { USER?: number; ADMIN?: number } } }>(
        'http://localhost:8080/api/loginstats'
      )
      .subscribe({
        next: (response) => {
          this.prepareChartData(response.data);
          console.log('Raw login stats response:', response);
        },
        error: (err) => {
          console.error('Failed to load login stats:', err);
        },
      });
  }
  prepareChartData(stats: {
    [key: string]: { USER?: number; ADMIN?: number };
  }) {
    const documentStyle = getComputedStyle(document.documentElement);

    const allDays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    const labels = allDays;
    const userData = labels.map((day) => stats[day]?.USER || 0);
    const adminData = labels.map((day) => stats[day]?.ADMIN || 0);

    this.data = {
      labels,
      datasets: [
        {
          label: 'ADMIN',
          data: adminData,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
        },
        {
          label: 'USER',
          data: userData,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          tension: 0.4,
        },
      ],
    };
    console.log('Chart stats:', stats);
    console.log('userData:', userData);
    console.log('adminData:', adminData);
  }
}
