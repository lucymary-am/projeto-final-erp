import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { PageLayoutComponent } from '../layout/page-layout';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, PageLayoutComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  currentUser = signal<any>(null);
  constructor(private authService: AuthService) {
    this.currentUser.set(this.authService.getCurrentUser());
  }
}
