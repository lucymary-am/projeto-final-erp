import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../layout/page-layout';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, PageLayoutComponent],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes {
}
