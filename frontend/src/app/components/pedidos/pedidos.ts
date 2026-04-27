import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../layout/page-layout';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule, PageLayoutComponent],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos {
}
