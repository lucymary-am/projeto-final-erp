import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ClientesComponent } from './features/cadastros/clientes/clientes.component';
import { CategoriasComponent } from './features/cadastros/categorias/categorias.component';
import { ProdutosComponent } from './features/cadastros/produtos/produtos.component';
import { FinanceiroComponent } from './features/cadastros/financeiro/financeiro.component';
import { MainLayoutComponent } from './features/layout/main-layout.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'produtos', component: ProdutosComponent },
      { path: 'financeiro', component: FinanceiroComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
