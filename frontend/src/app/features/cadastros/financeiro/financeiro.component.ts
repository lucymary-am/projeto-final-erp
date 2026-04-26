import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { parseApiError } from '../../../core/http/api-error.util';

type Financeiro = {
  id: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  status: 'pendente' | 'pago' | 'cancelado';
  data_vencimento: string;
  data_pagamento?: string;
};

@Component({
  selector: 'app-financeiro',
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './financeiro.component.html',
  styleUrl: './financeiro.component.scss'
})
export class FinanceiroComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  protected readonly registros = signal<Financeiro[]>([]);
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    tipo: ['despesa' as 'receita' | 'despesa', [Validators.required]],
    descricao: ['', [Validators.required, Validators.minLength(3)]],
    valor: [0, [Validators.required, Validators.min(0.01)]],
    data_vencimento: ['', [Validators.required]]
  });

  constructor() {
    this.loadRegistros();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.http
      .post(`${this.apiBaseUrl}/financeiro`, this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.form.reset({ tipo: 'despesa', descricao: '', valor: 0, data_vencimento: '' });
          this.loadRegistros();
          void Swal.fire('Sucesso', 'Registro financeiro cadastrado.', 'success');
        },
        error: (error) => {
          const parsed = parseApiError(error, 'Falha ao cadastrar registro financeiro.');
          void Swal.fire('Erro', parsed.validationErrors[0] ?? parsed.message, 'error');
        }
      });
  }

  protected pagar(id: string): void {
    this.http.patch(`${this.apiBaseUrl}/financeiro/${id}/pagar`, {}).subscribe({
      next: () => {
        this.loadRegistros();
        void Swal.fire('Sucesso', 'Registro marcado como pago.', 'success');
      },
      error: (error) => {
        const parsed = parseApiError(error, 'Falha ao atualizar pagamento.');
        void Swal.fire('Erro', parsed.validationErrors[0] ?? parsed.message, 'error');
      }
    });
  }

  private loadRegistros(): void {
    this.loading.set(true);
    this.http
      .get<Financeiro[]>(`${this.apiBaseUrl}/financeiro`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.registros.set(data),
        error: (error) => {
          const parsed = parseApiError(error, 'Falha ao carregar financeiro.');
          void Swal.fire('Erro', parsed.validationErrors[0] ?? parsed.message, 'error');
        }
      });
  }
}
