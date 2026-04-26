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
  protected readonly modalOpen = signal(false);
  protected readonly editingClienteId = signal<number | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required]],
    cpf_cnpj: ['', [Validators.required]],
    email: [''],
    telefone: ['']
  });

  constructor() {
    this.loadClientes();
  }

  protected get isEditing(): boolean {
    return this.editingClienteId() !== null;
  }

  protected openCreateModal(): void {
    this.editingClienteId.set(null);
    this.resetForm();
    this.modalOpen.set(true);
  }

  protected openEditModal(cliente: Cliente): void {
    this.editingClienteId.set(cliente.id);
    this.form.reset({
      nome: cliente.nome ?? '',
      cpf_cnpj: cliente.cpf_cnpj ?? '',
      email: cliente.email ?? '',
      telefone: cliente.telefone ?? ''
    });
    this.modalOpen.set(true);
  }

  protected closeModal(): void {
    if (this.submitting()) {
      return;
    }
    this.modalOpen.set(false);
    this.editingClienteId.set(null);
    this.resetForm();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    const editingId = this.editingClienteId();
    const request$ = editingId
      ? this.http.put<Cliente>(`${this.apiBaseUrl}/clientes/${editingId}`, payload)
      : this.http.post<Cliente>(`${this.apiBaseUrl}/clientes`, payload);

    this.submitting.set(true);
    request$
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          const successMessage = editingId
            ? 'Cliente atualizado com sucesso.'
            : 'Cliente cadastrado com sucesso.';
          void Swal.fire({
            title: 'Sucesso',
            text: successMessage,
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (!result.isConfirmed) {
              return;
            }
            this.closeModal();
            this.loadClientes();
          });
        },
        error: (error) => {
          const parsed = parseApiError(
            error,
            editingId ? 'Falha ao atualizar cliente.' : 'Falha ao cadastrar cliente.'
          );
          void Swal.fire('Erro', parsed.validationErrors[0] ?? parsed.message, 'error');
        }
      });
  }

  protected deleteCliente(cliente: Cliente): void {
    void Swal.fire({
      title: 'Excluir cliente?',
      text: `Deseja remover "${cliente.nome}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#b42318'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.http.delete<void>(`${this.apiBaseUrl}/clientes/${cliente.id}`).subscribe({
        next: () => {
          this.loadClientes();
          void Swal.fire('Excluido', 'Cliente removido com sucesso.', 'success');
        },
        error: (error) => {
          const parsed = parseApiError(error, 'Falha ao excluir cliente.');
          void Swal.fire('Erro', parsed.validationErrors[0] ?? parsed.message, 'error');
        }
      });
    });
  }

  private resetForm(): void {
    this.form.reset({ nome: '', cpf_cnpj: '', email: '', telefone: '' });
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
