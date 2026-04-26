import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { parseApiError } from '../../../core/http/api-error.util';

type Cliente = {
  id: number;
  nome: string;
  cpf_cnpj: string;
  email?: string;
  telefone?: string;
};

@Component({
  selector: 'app-clientes',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);
  protected readonly clientes = signal<Cliente[]>([]);

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required]],
    cpf_cnpj: ['', [Validators.required]],
    email: [''],
    telefone: ['']
  });

  constructor() {
    this.loadClientes();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.http
      .post<Cliente>(`${this.apiBaseUrl}/clientes`, this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.form.reset({ nome: '', cpf_cnpj: '', email: '', telefone: '' });
          this.loadClientes();
          void Swal.fire('Sucesso', 'Cliente cadastrado com sucesso.', 'success');
        },
        error: (error) => {
          const parsed = parseApiError(error, 'Falha ao cadastrar cliente.');
          void Swal.fire('Erro', parsed.validationErrors[0] ?? parsed.message, 'error');
        }
      });
  }

  private loadClientes(): void {
    this.loading.set(true);
    this.http
      .get<Cliente[]>(`${this.apiBaseUrl}/clientes`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.clientes.set(data),
        error: (error) => {
          const parsed = parseApiError(error, 'Falha ao carregar clientes.');
          void Swal.fire('Erro', parsed.validationErrors[0] ?? parsed.message, 'error');
        }
      });
  }
}
