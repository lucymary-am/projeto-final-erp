import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../services/constants';
import { PageLayoutComponent } from '../layout/page-layout';

type ProdutoResumo = {
  id: string;
  nome: string;
  preco: number;
  estoque_atual: number;
};

type LinhaFinanceiro = {
  id: string;
  nome: string;
  valorUnitario: number;
  quantidade: number;
  valorTotal: number;
};

@Component({
  selector: 'app-financeiro',
  imports: [CommonModule, PageLayoutComponent],
  templateUrl: './financeiro.html',
  styleUrl: './financeiro.css',
})
export class Financeiro {
  loading = signal(false);
  errorMessage = signal('');

  produtos = signal<ProdutoResumo[]>([]);
  constructor(private http: HttpClient) {
    this.carregarProdutos();
  }

  private mapApiProduto(p: any): ProdutoResumo {
    return {
      id: p.id_prod ?? p.id,
      nome: p.nome,
      preco: Number(p.preco ?? 0),
      estoque_atual: Number(p.estoque_atual ?? 0),
    };
  }

  async carregarProdutos() {
    try {
      this.loading.set(true);
      this.errorMessage.set('');
      const response = await firstValueFrom(this.http.get<any[]>(`${API_URL}/produtos`));
      const list = Array.isArray(response) ? response.map((p) => this.mapApiProduto(p)) : [];
      this.produtos.set(list);
    } catch (error) {
      console.error('Erro ao carregar produtos (financeiro):', error);
      this.errorMessage.set('Erro ao carregar produtos');
    } finally {
      this.loading.set(false);
    }
  }

  private formatBRL(value: number) {
    const v = Number(value ?? 0);
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  }

  get linhasFinanceiro(): LinhaFinanceiro[] {
    return this.produtos().map((p) => {
      const quantidade = Number(p.estoque_atual ?? 0);
      const valorUnitario = Number(p.preco ?? 0);
      return {
        id: p.id,
        nome: p.nome,
        valorUnitario,
        quantidade,
        valorTotal: valorUnitario * quantidade,
      };
    });
  }

  get totalGeral(): number {
    return this.linhasFinanceiro.reduce((acc, l) => acc + l.valorTotal, 0);
  }

  formatValorUnitario(v: number) {
    return this.formatBRL(v);
  }

  formatValorTotal(v: number) {
    return this.formatBRL(v);
  }

}
