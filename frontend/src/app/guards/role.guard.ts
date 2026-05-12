import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import type { Perfil } from '../services/profiles';
import { UsuarioPerfil } from '../enums/usuario-perfil';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  private rotaPorPerfil: Record<Perfil, string> = {
    [UsuarioPerfil.ADMINISTRADOR_SISTEMA]: '/usuarios',
    [UsuarioPerfil.GERENTE_SUPERVISOR]: '/usuarios',
    [UsuarioPerfil.OPERADOR_ESTOQUE]: '/produtos',
    [UsuarioPerfil.FINANCEIRO_CONTADOR]: '/financeiro',
    [UsuarioPerfil.APENAS_VISUALIZACAO]: '/dashboard',
    [UsuarioPerfil.VENDEDOR]: '/vendas',
  };

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    if (route.data['perfis']) {
      const perfilsRequeridos = Array.isArray(route.data['perfis'])
        ? route.data['perfis']
        : [route.data['perfis']];

      if (perfilsRequeridos.includes(user.funcao)) {
        return true;
      }

      const rotaPadrao = this.getRotaPadraoParaPerfil(user.funcao);
      this.router.navigate([rotaPadrao]);
      return false;
    }

    return true;
  }

  getRotaPadraoParaPerfil(perfil: Perfil): string {
    return this.rotaPorPerfil[perfil] || '/dashboard';
  }
}
