import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../services/constants';
import { isHandledValidationError } from '../../services/http-error.utils';
import { MessageService } from '../../services/message.service';
import { PageLayoutComponent } from '../layout/page-layout';
import { Vendas } from '../vendas/vendas';
import { PedidoStatus, isPedidoStatus, parsePedidoStatusOrDefault } from '../../enums/pedido-status';

export { PedidoStatus } from '../../enums/pedido-status';

export interface ItemPedidoView {
  id: number;
  produtoNome: string;
  quantidade: number;
  preco_unitario: number;
}

export interface PedidoView {
  id: string;
  codigo: string;
  clienteNome: string;
  usuarioNome: string;
  total: number;
  status: PedidoStatus;
  data_entrega?: string;
  created_at?: string;
  itens: ItemPedidoView[];
}

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule, FormsModule, PageLayoutComponent, Vendas],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos {
  readonly PedidoStatus = PedidoStatus;
  readonly filtroStatusTodos = 'todos' as const;

  loading = signal(false);
  errorMessage = signal('');

  mostraModalVendas = signal(false);
  /** Quando definido, o PDV carrega esse pedido (aberto = edição; demais = só leitura). */
  pedidoParaEditarNoPdv = signal<string | null>(null);
  /** Pedidos pago/cancelado: PDV só leitura (sem pagamento / novo pedido). */
  pdvSomenteLeitura = signal(false);
  excluindo = signal(false);
  atualizandoStatus = signal(false);

  /** Código exibido no título do modal (ex.: coluna Código da lista). */
  pedidoCodigoModal = signal<string | null>(null);
  filtroStatus = signal<'todos' | PedidoStatus>('todos');
  /** Substring, sem diferenciar maiúsculas. */
  filtroCodigo = signal('');
  filtroCliente = signal('');
  /** `YYYY-MM-DD` do `<input type="date">`, vazio = ignorado. */
  filtroDataDe = signal('');
  filtroDataAte = signal('');

  pedidos: PedidoView[] = [];
  pedidosFiltrados: PedidoView[] = [];

  constructor(private http: HttpClient) {
    void this.carregarPedidos();
  }

  abrirModalNovoPedido(): void {
    this.pdvSomenteLeitura.set(false);
    this.pedidoParaEditarNoPdv.set(null);
    this.pedidoCodigoModal.set(null);
    this.mostraModalVendas.set(true);
  }

  /** Abre o mesmo PDV para qualquer status; pago/cancelado em só leitura. */
  abrirFormularioVenda(p: PedidoView): void {
    this.pedidoParaEditarNoPdv.set(p.id);
    this.pedidoCodigoModal.set(String(p.codigo ?? '').trim() || null);
    this.pdvSomenteLeitura.set(p.status !== PedidoStatus.Aberto);
    this.mostraModalVendas.set(true);
  }

  tituloModalVendas(): string {
    const cod = (this.pedidoCodigoModal() ?? '').trim();
    const sufixo = cod ? ` · ${cod}` : '';
    if (!this.pedidoParaEditarNoPdv()) return 'Nova venda';
    if (this.pdvSomenteLeitura()) return `Pedido${sufixo}`;
    return `Alterar venda${sufixo}`;
  }

  fecharModalVendas(): void {
    this.mostraModalVendas.set(false);
    this.pedidoParaEditarNoPdv.set(null);
    this.pedidoCodigoModal.set(null);
    this.pdvSomenteLeitura.set(false);
  }

  onPedidoRegistradoNaVendas(): void {
    void this.carregarPedidos();
    this.fecharModalVendas();
  }

  private mapApiPedido(p: any): PedidoView {
    const itensRaw = Array.isArray(p.itens) ? p.itens : [];
    const itens: ItemPedidoView[] = itensRaw.map((i: any) => ({
      id: Number(i.id),
      produtoNome: i.produto?.nome ?? '—',
      quantidade: Number(i.quantidade ?? 0),
      preco_unitario: Number(i.preco_unitario ?? 0),
    }));

    return {
      id: String(p.id),
      codigo: String(p.codigo ?? '----'),
      clienteNome: p.cliente?.nome ?? '—',
      usuarioNome: p.usuario?.nome ?? '—',
      total: Number(p.total ?? 0),
      status: parsePedidoStatusOrDefault(p?.status),
      data_entrega: p.data_entrega ?? undefined,
      created_at: p.created_at ?? undefined,
      itens,
    };
  }

  private aplicarFiltro() {
    let list = [...this.pedidos];

    const f = this.filtroStatus();
    if (f !== 'todos') {
      list = list.filter((x) => x.status === f);
    }

    const cod = this.filtroCodigo().trim().toLowerCase();
    if (cod) {
      list = list.filter((x) => String(x.codigo ?? '').toLowerCase().includes(cod));
    }

    const cli = this.filtroCliente().trim().toLowerCase();
    if (cli) {
      list = list.filter((x) => String(x.clienteNome ?? '').toLowerCase().includes(cli));
    }

    const de = this.filtroDataDe().trim();
    const ate = this.filtroDataAte().trim();
    if (de || ate) {
      list = list.filter((p) => {
        const ymd = this.dataPedidoReferenciaYmd(p);
        if (!ymd) return false;
        if (de && ymd < de) return false;
        if (ate && ymd > ate) return false;
        return true;
      });
    }

    this.pedidosFiltrados = list;
  }

  /** Mesma referência da coluna Data: entrega se houver, senão criação (`YYYY-MM-DD` local). */
  private dataPedidoReferenciaYmd(p: PedidoView): string | null {
    const rawEntrega = p.data_entrega ? String(p.data_entrega).trim() : '';
    const rawCriado = p.created_at ? String(p.created_at).trim() : '';
    const use = rawEntrega || rawCriado;
    if (!use) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(use)) return use;
    const d = new Date(use);
    if (Number.isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  onFiltroCampoChange(): void {
    this.aplicarFiltro();
  }

  limparFiltrosBusca(): void {
    this.filtroCodigo.set('');
    this.filtroCliente.set('');
    this.filtroDataDe.set('');
    this.filtroDataAte.set('');
    this.aplicarFiltro();
  }

  onFiltroStatusChange(valor: string) {
    if (valor === this.filtroStatusTodos) {
      this.filtroStatus.set('todos');
      this.aplicarFiltro();
      return;
    }
    if (isPedidoStatus(valor)) {
      this.filtroStatus.set(valor);
      this.aplicarFiltro();
    }
  }

  async carregarPedidos() {
    try {
      this.loading.set(true);
      this.errorMessage.set('');
      const response = await firstValueFrom(this.http.get<any[]>(`${API_URL}/pedidos`));
      this.pedidos = Array.isArray(response) ? response.map((p) => this.mapApiPedido(p)) : [];
      this.aplicarFiltro();
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      this.errorMessage.set('Erro ao carregar pedidos');
    } finally {
      this.loading.set(false);
    }
  }

  labelStatus(s: PedidoStatus): string {
    const map: Record<PedidoStatus, string> = {
      [PedidoStatus.Aberto]: 'Aberto',
      [PedidoStatus.Pago]: 'Pago',
      [PedidoStatus.Cancelado]: 'Cancelado',
    };
    return map[s] ?? s;
  }

  classeStatus(s: PedidoStatus): string {
    if (s === PedidoStatus.Pago) return 'status-pago';
    if (s === PedidoStatus.Cancelado) return 'status-cancelado';
    return 'status-aberto';
  }

  pedidoEditavelNaLista(status: PedidoStatus): boolean {
    return status === PedidoStatus.Aberto;
  }

  pedidoSomenteVisualizacaoNaLista(status: PedidoStatus): boolean {
    return status === PedidoStatus.Pago || status === PedidoStatus.Cancelado;
  }

  podePagarPedido(statusAtual: PedidoStatus): boolean {
    return statusAtual === PedidoStatus.Aberto;
  }

  podeCancelarPedido(statusAtual: PedidoStatus): boolean {
    return statusAtual === PedidoStatus.Aberto;
  }

  async pagarPedido(p: PedidoView) {
    await this.atualizarStatusPedidoLista(p, PedidoStatus.Pago);
  }

  async cancelarPedido(p: PedidoView) {
    await this.atualizarStatusPedidoLista(p, PedidoStatus.Cancelado);
  }

  private async atualizarStatusPedidoLista(p: PedidoView, status: PedidoStatus) {
    if (p.status === status) return;
    const acao = status === PedidoStatus.Pago ? 'pagar' : 'cancelar';
    const ok = await MessageService.confirmAction(`Tem certeza que deseja ${acao} este pedido?`, {
      title: 'Confirma alteração de status',
      confirmButtonText: status === PedidoStatus.Pago ? 'Pagar' : 'Cancelar pedido',
      confirmButtonColor: status === PedidoStatus.Pago ? '#2e7d32' : '#dc2626',
    });
    if (!ok) return;

    try {
      this.atualizandoStatus.set(true);
      await firstValueFrom(this.http.patch(`${API_URL}/pedidos/${p.id}/status`, { status }));
      await this.carregarPedidos();
      await MessageService.success(`Pedido ${this.labelStatus(status).toLowerCase()} com sucesso`);
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      if (isHandledValidationError(error)) return;
      const message = MessageService.extractErrorMessage(error, 'Erro ao atualizar status do pedido');
      void MessageService.error(message);
    } finally {
      this.atualizandoStatus.set(false);
    }
  }

  async excluirPedido(p: PedidoView) {
    await this.excluirPedidoPorId(p.id);
  }

  private async excluirPedidoPorId(id: string) {
    const ok = await MessageService.confirmDelete('Tem certeza que deseja excluir este pedido?');
    if (!ok) return;

    try {
      this.excluindo.set(true);
      await firstValueFrom(this.http.delete(`${API_URL}/pedidos/${id}`));
      await this.carregarPedidos();
      await MessageService.success('Pedido excluído');
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      if (isHandledValidationError(error)) return;
      const message = MessageService.extractErrorMessage(error, 'Erro ao excluir pedido');
      void MessageService.error(message);
    } finally {
      this.excluindo.set(false);
    }
  }

  podeExcluirPedido(statusAtual: PedidoStatus): boolean {
    return statusAtual !== PedidoStatus.Pago;
  }

  mensagemListaVazia(): string {
    if (this.pedidos.length === 0) {
      return 'Nenhum pedido cadastrado. Clique em "+ Nova Venda" para registrar.';
    }
    return 'Nenhum pedido corresponde aos filtros aplicados.';
  }

}
