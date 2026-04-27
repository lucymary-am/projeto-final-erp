import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

type PageKey = 'dashboard' | 'produtos' | 'categorias' | 'financeiro' | 'movimentacoes' | 'clientes' | 'pedidos' | 'usuarios';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-layout.html',
  styleUrl: './page-layout.css',
})
export class PageLayoutComponent {
  currentPage = input.required<PageKey>();

  currentUser = signal<any>(null);
  menuAberto = signal(false);
  menuRecolhido = signal(false);
  menuUsuarioAberto = signal(false);

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser.set(this.authService.getCurrentUser());
    if (!this.currentUser()) {
      this.router.navigate(['/login']);
    }
  }

  private perfilAtual() {
    return this.currentUser()?.funcao ?? null;
  }

  isPaginaAtiva(page: PageKey) {
    return this.currentPage() === page;
  }

  podeVerProdutos() {
    const p = this.perfilAtual();
    return p === 'ADMINISTRADOR_SISTEMA' || p === 'GERENTE_SUPERVISOR' || p === 'OPERADOR_ESTOQUE';
  }

  podeVerCategorias() {
    const p = this.perfilAtual();
    return p === 'ADMINISTRADOR_SISTEMA' || p === 'GERENTE_SUPERVISOR' || p === 'OPERADOR_ESTOQUE';
  }

  podeVerFinanceiro() {
    const p = this.perfilAtual();
    return p === 'ADMINISTRADOR_SISTEMA' || p === 'GERENTE_SUPERVISOR' || p === 'FINANCEIRO_CONTADOR';
  }

  podeVerMovimentacoes() {
    const p = this.perfilAtual();
    return (
      p === 'ADMINISTRADOR_SISTEMA' ||
      p === 'GERENTE_SUPERVISOR' ||
      p === 'OPERADOR_ESTOQUE' ||
      p === 'FINANCEIRO_CONTADOR'
    );
  }

  podeVerClientes() {
    const p = this.perfilAtual();
    return p === 'ADMINISTRADOR_SISTEMA' || p === 'GERENTE_SUPERVISOR' || p === 'FINANCEIRO_CONTADOR';
  }

  podeVerPedidos() {
    const p = this.perfilAtual();
    return p === 'ADMINISTRADOR_SISTEMA' || p === 'GERENTE_SUPERVISOR' || p === 'FINANCEIRO_CONTADOR';
  }

  podeVerUsuarios() {
    const p = this.perfilAtual();
    return p === 'ADMINISTRADOR_SISTEMA';
  }

  irParaDashboard() {
    this.router.navigate(['/dashboard']);
  }

  irParaProdutos() {
    this.router.navigate(['/produtos']);
  }

  irParaCategorias() {
    this.router.navigate(['/categorias']);
  }

  irParaFinanceiro() {
    this.router.navigate(['/financeiro']);
  }

  irParaMovimentacoes() {
    this.router.navigate(['/movimentacoes']);
  }

  irParaClientes() {
    this.router.navigate(['/clientes']);
  }

  irParaPedidos() {
    this.router.navigate(['/pedidos']);
  }

  irParaUsuarios() {
    this.router.navigate(['/usuarios']);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleMenuRecolhido() {
    this.menuRecolhido.set(!this.menuRecolhido());
  }

  toggleMenuUsuario() {
    this.menuUsuarioAberto.set(!this.menuUsuarioAberto());
  }

  getNomeUsuario() {
    return this.currentUser()?.nome || 'Usuário';
  }

  getPerfilUsuario() {
    const perfil = this.currentUser()?.funcao;
    if (!perfil) {
      return 'Sem perfil';
    }

    return perfil
      .toLowerCase()
      .split('_')
      .map((parte: string) => parte.charAt(0).toUpperCase() + parte.slice(1))
      .join(' ');
  }
}
