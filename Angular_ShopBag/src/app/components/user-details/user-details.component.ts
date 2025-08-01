import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Auth } from '../../models/auth';
import { HeaderComponent } from '../../layout/header/header.component';
import { CommonModule } from '@angular/common';
import { Order } from '../../models/auth';
import { FooterComponent } from '../../layout/footer/footer.component';
@Component({
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent implements OnInit {
  user!: Auth; // or `user: Auth | undefined;`

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.authService.getUserById(id).subscribe((data) => {
      this.user = data;
    });
  }
}
