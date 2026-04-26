import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { RegisterService } from './register.service';
import { PerfilUsuario } from './register.types';
import { parseApiError } from '../../../core/http/api-error.util';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly registerService = inject(RegisterService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly validationErrors = signal<string[]>([]);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly showPassword = signal(false);
  protected readonly showConfirmPassword = signal(false);
  protected readonly perfis: Array<{ label: string; value: PerfilUsuario }> = [
    { label: 'Solicitante', value: 'SOLICITANTE' },
    { label: 'Gestor', value: 'GESTOR' },
    { label: 'Comprador', value: 'COMPRADOR' }
  ];

  protected readonly registerForm = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    sobrenome: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    perfil: ['SOLICITANTE' as PerfilUsuario, [Validators.required]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmacao: ['', [Validators.required]],
    termos: [false, [Validators.requiredTrue]]
  });

  protected submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { nome, sobrenome, email, perfil, senha, confirmacao } = this.registerForm.getRawValue();

    if (senha !== confirmacao) {
      void Swal.fire({
        icon: 'warning',
        title: 'Validacao',
        text: 'Senha e confirmacao precisam ser iguais.',
        confirmButtonText: 'OK'
      });
      this.errorMessage.set(null);
      this.validationErrors.set([]);
      return;
    }

    this.errorMessage.set(null);
    this.validationErrors.set([]);
    this.successMessage.set(null);
    this.loading.set(true);

    const nomeCompleto = `${nome.trim()} ${sobrenome.trim()}`.trim();
    this.registerService
      .register({
        nome: nomeCompleto,
        email: email.trim(),
        password: senha,
        perfil
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('Conta criada com sucesso. Faca login para continuar.');
          this.validationErrors.set([]);
          setTimeout(() => void this.router.navigate(['/login']), 1000);
        },
        error: (error) => {
          const parsedError = parseApiError(
            error,
            'Falha ao criar conta. Se aparecer 401, o backend ainda exige login para criar usuario.'
          );
          const firstMessage = parsedError.validationErrors[0] ?? parsedError.message;
          this.errorMessage.set(null);
          this.validationErrors.set([]);
          void Swal.fire({
            icon: 'error',
            title: 'Erro ao criar conta',
            text: firstMessage,
            confirmButtonText: 'OK'
          });
        }
      });
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  protected toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((value) => !value);
  }
}
