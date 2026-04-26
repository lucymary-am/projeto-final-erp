import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UsuarioAuth } from '../../core/auth/auth.types';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly currentUser: UsuarioAuth = this.getCurrentUser();
  protected readonly userMenuOpen = signal(false);
  protected readonly logoutLoading = signal(false);

  protected get userInitials(): string {
    const trimmedName = this.currentUser.nome.trim();
    if (!trimmedName) {
      return 'U';
    }

    const nameParts = trimmedName.split(/\s+/);
    const first = nameParts[0]?.charAt(0) ?? 'U';
    const second = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) : '';

    return `${first}${second}`.toUpperCase();
  }

  protected get userProfileLabel(): string {
    const rawProfile = String(this.currentUser.perfil ?? '').trim();
    if (!rawProfile) {
      return 'Perfil';
    }

    const profileMap: Record<string, string> = {
      '0': 'Solicitante',
      '1': 'Gestor',
      '2': 'Comprador',
      SOLICITANTE: 'Solicitante',
      GESTOR: 'Gestor',
      COMPRADOR: 'Comprador'
    };

    const normalizedProfile = rawProfile.toUpperCase();
    return profileMap[rawProfile] ?? profileMap[normalizedProfile] ?? rawProfile;
  }

  protected toggleUserMenu(): void {
    this.userMenuOpen.update((value) => !value);
  }

  protected logout(event: MouseEvent): void {
    event.stopPropagation();
    this.logoutLoading.set(true);

    this.authService.logout().subscribe({
      next: () => void this.router.navigate(['/login']),
      error: () => void this.router.navigate(['/login']),
      complete: () => this.logoutLoading.set(false)
    });
  }

  @HostListener('document:click')
  protected closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  private getCurrentUser(): UsuarioAuth {
    const fallbackUser: UsuarioAuth = {
      id_user: '',
      nome: 'Usuario',
      email: '',
      perfil: 'Perfil'
    };

    try {
      const rawUser = localStorage.getItem('erp_user');
      if (!rawUser) {
        return fallbackUser;
      }

      const parsedUser = JSON.parse(rawUser) as Partial<UsuarioAuth> & { role?: string };
      return {
        id_user: parsedUser.id_user ?? '',
        nome: parsedUser.nome ?? fallbackUser.nome,
        email: parsedUser.email ?? '',
        perfil: parsedUser.perfil ?? parsedUser.role ?? fallbackUser.perfil
      };
    } catch {
      return fallbackUser;
    }
  }
}
