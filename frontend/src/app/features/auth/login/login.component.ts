import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/auth/auth.service';
import { parseApiError } from '../../../core/http/api-error.util';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly validationErrors = signal<string[]>([]);
  protected readonly showPassword = signal(false);

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    lembrarMe: [false]
  });

  protected submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.validationErrors.set([]);
    this.loading.set(true);

    const { email, senha } = this.loginForm.getRawValue();
    this.authService
      .login({ email, senha })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => void this.router.navigate(['/dashboard']),
        error: (error) => {
          const parsedError = parseApiError(error, 'Falha ao entrar.');
          const firstMessage = parsedError.validationErrors[0] ?? parsedError.message;
          this.errorMessage.set(null);
          this.validationErrors.set([]);
          void Swal.fire({
            icon: 'error',
            title: 'Erro ao entrar',
            text: firstMessage,
            confirmButtonText: 'OK'
          });
        }
      });
  }

  protected loginWithGoogle(): void {
    this.errorMessage.set(null);
    this.validationErrors.set([]);
    this.loading.set(true);

    this.authService
      .loginWithGoogle()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => void this.router.navigate(['/dashboard']),
        error: (error) => {
          const parsedError = parseApiError(
            error,
            'Falha na autenticacao Google. Verifique a API /auth/google.'
          );
          const firstMessage = parsedError.validationErrors[0] ?? parsedError.message;
          this.errorMessage.set(null);
          this.validationErrors.set([]);
          void Swal.fire({
            icon: 'error',
            title: 'Erro ao autenticar com Google',
            text: firstMessage,
            confirmButtonText: 'OK'
          });
        }
      });
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }
}
