import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { parseApiError } from '../../../core/http/api-error.util';

type Categoria = {
  id: string;
  nome: string;
  descricao?: string;
};

@Component({
  selector: 'app-categorias',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required]],
    descricao: ['']
  });

  constructor() {
    this.loadCategorias();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.http
      .post<Categoria>(`${this.apiBaseUrl}/categorias`, this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.form.reset({ nome: '', descricao: '' });
          this.loadCategorias();
          void Swal.fire('Sucesso', 'Categoria cadastrada com sucesso.', 'success');
        },
        error: (error) => {
          const parsed = parseApiError(error, 'Falha ao cadastrar categoria.');
          void Swal.fire('Erro', parsed.validationErrors[0] ?? parsed.message, 'error');
        }
      });
  }

  private loadCategorias(): void {
    this.loading.set(true);
    this.http
      .get<Categoria[]>(`${this.apiBaseUrl}/categorias`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.categorias.set(data),
        error: (error) => {
          const parsed = parseApiError(error, 'Falha ao carregar categorias.');
          void Swal.fire('Erro', parsed.validationErrors[0] ?? parsed.message, 'error');
        }
      });
  }
}
