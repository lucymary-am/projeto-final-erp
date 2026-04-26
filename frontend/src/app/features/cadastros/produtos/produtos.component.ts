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
};

type Produto = {
  id_prod: string;
  nome: string;
  codigo: string;
  preco: number;
  estoque_atual: number;
  estoque_minimo: number;
  ativo: boolean;
  categoria?: Categoria;
};

@Component({
  selector: 'app-produtos',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);
  protected readonly produtos = signal<Produto[]>([]);
  protected readonly categorias = signal<Categoria[]>([]);

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required]],
    descricao: [''],
    codigo: ['', [Validators.required]],
    preco: [0, [Validators.required, Validators.min(0.01)]],
    estoque_atual: [0, [Validators.required, Validators.min(0)]],
    estoque_minimo: [0, [Validators.required, Validators.min(0)]],
    estoque_maximo: [0, [Validators.min(0)]],
    categoriaId: ['']
  });

  constructor() {
    this.loadCategorias();
    this.loadProdutos();
  }

  protected get totalProdutos(): number {
    return this.produtos().length;
  }

  protected get ativosCount(): number {
    return this.produtos().filter((produto) => produto.ativo).length;
  }

  protected get inativosCount(): number {
    return this.produtos().filter((produto) => !produto.ativo).length;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload = {
      nome: raw.nome.trim(),
      descricao: raw.descricao?.trim() || null,
      codigo: raw.codigo.trim(),
      preco: Number(raw.preco),
      estoque_atual: Number(raw.estoque_atual),
      estoque_minimo: Number(raw.estoque_minimo),
      estoque_maximo: raw.estoque_maximo > 0 ? Number(raw.estoque_maximo) : null,
      categoriaId: raw.categoriaId || undefined
    };

    this.submitting.set(true);
    this.http
      .post<Produto>(`${this.apiBaseUrl}/produtos`, payload)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.form.reset({
            nome: '',
            descricao: '',
            codigo: '',
            preco: 0,
            estoque_atual: 0,
            estoque_minimo: 0,
            estoque_maximo: 0,
            categoriaId: ''
          });
          this.loadProdutos();
          void Swal.fire('Sucesso', 'Produto cadastrado com sucesso.', 'success');
        },
        error: (error) => {
          const parsed = parseApiError(error, 'Falha ao cadastrar produto.');
          void Swal.fire('Erro', parsed.validationErrors[0] ?? parsed.message, 'error');
        }
      });
  }

  private loadProdutos(): void {
    this.loading.set(true);
    this.http
      .get<Produto[]>(`${this.apiBaseUrl}/produtos`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.produtos.set(data),
        error: (error) => {
          const parsed = parseApiError(error, 'Falha ao carregar produtos.');
          void Swal.fire('Erro', parsed.validationErrors[0] ?? parsed.message, 'error');
        }
      });
  }

  private loadCategorias(): void {
    this.http.get<Categoria[]>(`${this.apiBaseUrl}/categorias`).subscribe({
      next: (data) => this.categorias.set(data),
      error: () => this.categorias.set([])
    });
  }
}
