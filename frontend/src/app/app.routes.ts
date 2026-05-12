import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Cadastro } from './components/cadastro/cadastro';
import { Dashboard } from './components/dashboard/dashboard';
import { Financeiro } from './components/financeiro/financeiro';
import { Movimentacoes } from './components/movimentacoes/movimentacoes';
import { Clientes } from './components/clientes/clientes';
import { Pedidos } from './components/pedidos/pedidos';
import { Vendas } from './components/vendas/vendas';
import { Produtos } from './components/produtos/produtos';
import { Categorias } from './components/categorias/categorias';
import { UsuariosComponent } from './components/usuarios/usuarios';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UsuarioPerfil } from './enums/usuario-perfil';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'produtos',
    component: Produtos,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      perfis: [
        UsuarioPerfil.ADMINISTRADOR_SISTEMA,
        UsuarioPerfil.GERENTE_SUPERVISOR,
        UsuarioPerfil.OPERADOR_ESTOQUE,
        UsuarioPerfil.VENDEDOR,
      ],
    },
  },
  {
    path: 'categorias',
    component: Categorias,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      perfis: [
        UsuarioPerfil.ADMINISTRADOR_SISTEMA,
        UsuarioPerfil.GERENTE_SUPERVISOR,
        UsuarioPerfil.OPERADOR_ESTOQUE,
      ],
    },
  },
  {
    path: 'financeiro',
    component: Financeiro,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      perfis: [
        UsuarioPerfil.ADMINISTRADOR_SISTEMA,
        UsuarioPerfil.GERENTE_SUPERVISOR,
        UsuarioPerfil.FINANCEIRO_CONTADOR,
      ],
    },
  },
  {
    path: 'movimentacoes',
    component: Movimentacoes,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      perfis: [
        UsuarioPerfil.ADMINISTRADOR_SISTEMA,
        UsuarioPerfil.GERENTE_SUPERVISOR,
        UsuarioPerfil.OPERADOR_ESTOQUE,
        UsuarioPerfil.FINANCEIRO_CONTADOR,
        UsuarioPerfil.VENDEDOR,
      ],
    },
  },
  {
    path: 'clientes',
    component: Clientes,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      perfis: [
        UsuarioPerfil.ADMINISTRADOR_SISTEMA,
        UsuarioPerfil.GERENTE_SUPERVISOR,
        UsuarioPerfil.FINANCEIRO_CONTADOR,
        UsuarioPerfil.VENDEDOR,
      ],
    },
  },
  {
    path: 'pedidos',
    component: Pedidos,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      perfis: [UsuarioPerfil.ADMINISTRADOR_SISTEMA, UsuarioPerfil.GERENTE_SUPERVISOR, UsuarioPerfil.VENDEDOR],
    },
  },
  {
    path: 'vendas',
    component: Vendas,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      perfis: [UsuarioPerfil.ADMINISTRADOR_SISTEMA, UsuarioPerfil.GERENTE_SUPERVISOR, UsuarioPerfil.VENDEDOR],
    },
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      perfis: [UsuarioPerfil.ADMINISTRADOR_SISTEMA, UsuarioPerfil.GERENTE_SUPERVISOR],
    },
  },
  { path: '**', redirectTo: 'login' },
];
