import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-components',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './components.component.html',
  styleUrl: './components.component.css',
})
export class ComponentsComponent {}
