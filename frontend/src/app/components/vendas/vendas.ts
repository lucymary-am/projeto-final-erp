import { Component, signal, computed, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../services/constants';
import { AuthService } from '../../services/auth';
import { isHandledValidationError } from '../../services/http-error.utils';
import { MessageService } from '../../services/message.service';
import { PageLayoutComponent } from '../layout/page-layout';
import { CurrencyInputComponent } from '../currency-input/currency-input';
import { PedidoStatus, isPedidoStatus } from '../../enums/pedido-status';

type ClienteOption = { id: number; nome: string };
type ProdutoOption = { id: string; nome: string; preco: number; estoque_atual: number };

interface ItemCarrinho {
  produtoId: string;
  nome: string;
  quantidade: number;
  preco_unitario: number;
}

type FormaPagamento = 'dinheiro' | 'cartao' | 'pix' | 'boleto';

@Component({
  selector: 'app-vendas',
  imports: [CommonModule, FormsModule, PageLayoutComponent, CurrencyInputComponent],
  templateUrl: './vendas.html',
  styleUrl: './vendas.css',
})
export class Vendas {
  readonly PedidoStatus = PedidoStatus;

  /** Quando true, não usa `app-page-layout` (ex.: modal em Pedidos). */
  embedded = input(false);
  /** Se informado, carrega o pedido em aberto no PDV para alteração (lista em Pedidos). */
  pedidoParaEditarId = input<string | null>(null);
  /** Pedidos pagos/cancelados: mesma tela, sem pagamento nem novo pedido (lista em Pedidos). */
  somenteLeitura = input(false);
  /** Emitido após venda/pedido gravado com sucesso na API. */
  pedidoRegistrado = output<void>();

  salvando = signal(false);

  clienteBusca = signal('');
  clienteSelecionadoId = signal('');
  clientesAutocomplete = signal<ClienteOption[]>([]);
  autocompleteClienteAberto = signal(false);
  buscandoClientes = signal(false);

  pesquisaProduto = signal('');
  quantidadeAdd = signal(1);

  itensCarrinho = signal<ItemCarrinho[]>([]);
  formaPagamento = signal<FormaPagamento>('dinheiro');

  /** Após clicar em "Confirmar pagamento": exibe desconto e formas de pagamento. */
  pagamentoDetalheAberto = signal(false);
  /** Valor de desconto em reais (limitado ao subtotal na exibição e no total). */
  descontoValor = signal(0);

  mostraModalPedido = signal(false);
  dataEntrega = signal('');

  /** Preenchido ao carregar pedido em modo somente leitura (lista Pedidos). */
  pedidoVisualizacaoData = signal<string | null>(null);
  /** Somente pedidos `pago`: data em que o pagamento foi registrado (API `data_pagamento`). */
  pedidoVisualizacaoDataPagamento = signal<string | null>(null);
  pedidoVisualizacaoResponsavel = signal<string | null>(null);

  /** Preenchido ao carregar pedido via API (para rótulos no resumo, ex.: TOTAL PAGO). */
  pedidoStatusCarregado = signal<PedidoStatus | null>(null);

  /** Desconto gravado no pedido (modo somente leitura / exibição). */
  pedidoDescontoLeitura = signal(0);

  clientes = signal<ClienteOption[]>([]);
  private clientesLoadPromise: Promise<void> | null = null;
  produtos: ProdutoOption[] = [];

  mostrarListaProdutos = signal(false);

  produtosFiltrados = computed(() => {
    if (!this.mostrarListaProdutos()) return [];
    const termo = this.pesquisaProduto().toLowerCase().trim();
    if (!termo) return this.produtos;
    return this.produtos.filter((p) => p.nome.toLowerCase().includes(termo));
  });

  subtotal = computed(() =>
    this.itensCarrinho().reduce((acc, i) => acc + i.quantidade * i.preco_unitario, 0)
  );

  descontoAplicado = computed(() => {
    const sub = this.subtotal();
    const raw = Number(this.descontoValor());
    const d = Number.isFinite(raw) && raw > 0 ? raw : 0;
    return Math.min(d, sub);
  });

  /** Desconto exibido no resumo (leitura usa API; edição usa campo do PDV). */
  descontoEfetivoResumo = computed(() => {
    if (this.somenteLeitura()) {
      const sub = this.subtotal();
      const raw = Number(this.pedidoDescontoLeitura());
      const d = Number.isFinite(raw) && raw > 0 ? raw : 0;
      return Math.min(d, sub);
    }
    return this.descontoAplicado();
  });

  totalPagar = computed(() => Math.max(0, this.subtotal() - this.descontoEfetivoResumo()));

  private clienteBuscaTimer: ReturnType<typeof setTimeout> | null = null;

  /** Nome do cliente vindo do último GET /pedidos/:id (ajuda a reconhecer texto “confirmado” na busca). */
  private nomeClienteUltimoPedidoHidratado = '';

  /** Evita que respostas antigas de GET /pedidos sobrescrevam outro pedido. */
  private hidratarPedidoSeq = 0;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    void this.carregarProdutos();
    effect(() => {
      const id = this.pedidoParaEditarId()?.trim() ?? '';
      if (!id) {
        this.novaVenda();
        return;
      }
      void this.hidratarPedidoCarregado(id);
    });
  }

  private bloqueadoSomenteLeitura(msg = 'Este pedido esta em modo visualizacao.'): boolean {
    if (!this.somenteLeitura()) return false;
    void MessageService.validationError(msg);
    return true;
  }

  private limparMetaVisualizacaoPedido(): void {
    this.pedidoVisualizacaoData.set(null);
    this.pedidoVisualizacaoDataPagamento.set(null);
    this.pedidoVisualizacaoResponsavel.set(null);
    this.pedidoStatusCarregado.set(null);
    this.pedidoDescontoLeitura.set(0);
  }

  private formatarDataPedidoApi(raw: unknown): string {
    if (raw == null || raw === '') return '—';
    const d = new Date(String(raw));
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private extrairClienteDoPedidoApi(p: any): { id: string; nome: string } | null {
    const cli = p?.cliente ?? p?.Cliente;
    const rawId = cli?.id ?? p?.clienteId ?? p?.cliente_id;
    if (rawId == null || String(rawId).trim() === '') return null;
    const nome = String(cli?.nome ?? '').trim();
    return { id: String(rawId).trim(), nome };
  }

  private aplicarClienteDoPedidoHidratado(cli: { id: string; nome: string } | null): void {
    if (!cli) {
      this.nomeClienteUltimoPedidoHidratado = '';
      this.clienteSelecionadoId.set('');
      this.clienteBusca.set('');
      return;
    }
    const num = Number(cli.id);
    let nome = cli.nome.trim();
    if ((!nome || nome.length === 0) && Number.isFinite(num) && num > 0) {
      const found = this.clientes().find((c) => Number(c.id) === num);
      if (found?.nome) nome = String(found.nome).trim();
    }
    this.nomeClienteUltimoPedidoHidratado = nome;
    this.clienteSelecionadoId.set(cli.id);
    this.clienteBusca.set(nome);
  }

  private async hidratarPedidoCarregado(id: string): Promise<void> {
    const seq = ++this.hidratarPedidoSeq;
    try {
      this.limparMetaVisualizacaoPedido();
      await this.carregarProdutos();
      if (seq !== this.hidratarPedidoSeq) return;
      await this.carregarClientes();
      if (seq !== this.hidratarPedidoSeq) return;
      const p = await firstValueFrom(this.http.get<any>(`${API_URL}/pedidos/${encodeURIComponent(id)}`));
      if (seq !== this.hidratarPedidoSeq) return;
      if (!p) {
        void MessageService.error('Pedido nao encontrado.');
        return;
      }

      this.aplicarClienteDoPedidoHidratado(this.extrairClienteDoPedidoApi(p));

      if (seq !== this.hidratarPedidoSeq) return;

      const itensRaw = Array.isArray(p.itens) ? p.itens : [];
      const carrinho: ItemCarrinho[] = itensRaw
        .map((it: any) => {
          const produtoId = String(it.produto?.id_prod ?? it.produto_id ?? '').trim();
          const nome = String(it.produto?.nome ?? 'Produto');
          const quantidade = Math.max(1, Math.floor(Number(it.quantidade ?? 0)));
          const preco_unitario = Number(it.preco_unitario ?? 0);
          return { produtoId, nome, quantidade, preco_unitario };
        })
        .filter((it: ItemCarrinho) => it.produtoId.length > 0);

      this.itensCarrinho.set(carrinho);
      this.pesquisaProduto.set('');
      this.quantidadeAdd.set(1);
      this._produtoSelecionado = null;

      const descRaw = Number(p?.desconto ?? 0);
      const descontoApi = Number.isFinite(descRaw) && descRaw > 0 ? descRaw : 0;
      if (this.somenteLeitura()) {
        this.pedidoDescontoLeitura.set(descontoApi);
        this.descontoValor.set(0);
        this.pagamentoDetalheAberto.set(false);
      } else {
        this.pedidoDescontoLeitura.set(0);
        this.descontoValor.set(descontoApi);
        this.pagamentoDetalheAberto.set(descontoApi > 0);
      }
      if (p.data_entrega) {
        this.dataEntrega.set(String(p.data_entrega).slice(0, 10));
      }

      const statusApi = String(p?.status ?? '').trim();
      const stOk: PedidoStatus | null = isPedidoStatus(statusApi) ? statusApi : null;
      this.pedidoStatusCarregado.set(stOk);

      if (this.somenteLeitura()) {
        this.pedidoVisualizacaoData.set(this.formatarDataPedidoApi(p.created_at));
        const nomeResp = String(p.usuario?.nome ?? '').trim();
        this.pedidoVisualizacaoResponsavel.set(nomeResp.length > 0 ? nomeResp : '—');
        if (stOk === PedidoStatus.Pago) {
          const dp = p.data_pagamento ?? p.created_at;
          this.pedidoVisualizacaoDataPagamento.set(this.formatarDataPedidoApi(dp));
        } else {
          this.pedidoVisualizacaoDataPagamento.set(null);
        }
      }
    } catch (e) {
      console.error(e);
      void MessageService.error('Nao foi possivel carregar o pedido.');
      this.limparMetaVisualizacaoPedido();
    }
  }

  /** Dedup + atualização via signal (compatível com HttpClient `withFetch`, fora da zona). */
  carregarClientes(): Promise<void> {
    if (this.clientesLoadPromise) return this.clientesLoadPromise;
    this.clientesLoadPromise = firstValueFrom(this.http.get<any[]>(`${API_URL}/clientes`))
      .then((res) => {
        const list = Array.isArray(res) ? res.map((c) => ({ id: Number(c.id), nome: c.nome })) : [];
        this.clientes.set(list);
      })
      .catch(() => {
        this.clientes.set([]);
      })
      .finally(() => {
        this.clientesLoadPromise = null;
      });
    return this.clientesLoadPromise;
  }

  private atualizarClientesAutocomplete(termo: string): void {
    const t = termo.trim().toLowerCase();
    if (t.length < 2) {
      this.clientesAutocomplete.set([]);
      return;
    }
    const filtrados = this.clientes()
      .filter((c) => c.nome.toLowerCase().includes(t))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }))
      .slice(0, 12);
    this.clientesAutocomplete.set(filtrados);
  }

  private textoCorrespondeClienteSelecionado(valor: string): boolean {
    const idAtual = this.clienteSelecionadoId().trim();
    if (!idAtual) return false;
    const num = Number(idAtual);
    if (!Number.isFinite(num) || num <= 0) return false;
    const v = valor.trim();
    if (!v) return false;
    const known = this.clientes().find((c) => Number(c.id) === num);
    if (known && v.localeCompare(known.nome.trim(), 'pt-BR', { sensitivity: 'base' }) === 0) {
      return true;
    }
    const ref = this.nomeClienteUltimoPedidoHidratado.trim();
    return ref.length > 0 && v.localeCompare(ref, 'pt-BR', { sensitivity: 'base' }) === 0;
  }

  onClienteBuscaInput(ev: Event): void {
    const el = ev.target as HTMLInputElement | null;
    this.onClienteBuscaChange(el?.value ?? '');
  }

  onClienteBuscaChange(valor: string): void {
    if (this.somenteLeitura()) return;

    if (this.textoCorrespondeClienteSelecionado(valor)) {
      this.clienteBusca.set(valor);
      return;
    }

    this.clienteBusca.set(valor);
    this.clienteSelecionadoId.set('');

    if (this.clienteBuscaTimer) {
      clearTimeout(this.clienteBuscaTimer);
    }

    const termo = valor.trim();
    if (termo.length < 2) {
      this.clientesAutocomplete.set([]);
      return;
    }

    this.clienteBuscaTimer = setTimeout(() => {
      void this.carregarClientes().then(() => {
        this.atualizarClientesAutocomplete(termo);
        this.autocompleteClienteAberto.set(this.clientesAutocomplete().length > 0);
      });
    }, 300);
  }

  onClienteBuscaFocus(): void {
    if (this.somenteLeitura()) return;
    this.buscandoClientes.set(true);
    void this.carregarClientes().finally(() => {
      this.buscandoClientes.set(false);
      const termo = this.clienteBusca().trim();
      if (termo.length >= 2) {
        this.atualizarClientesAutocomplete(termo);
        this.autocompleteClienteAberto.set(this.clientesAutocomplete().length > 0);
      } else {
        this.clientesAutocomplete.set([]);
        this.autocompleteClienteAberto.set(false);
      }
    });
  }

  onClienteBuscaBlur(): void {
    setTimeout(() => this.autocompleteClienteAberto.set(false), 150);
  }

  selecionarClienteAutocomplete(c: ClienteOption): void {
    if (this.somenteLeitura()) return;
    this.clienteSelecionadoId.set(String(c.id));
    this.clienteBusca.set(c.nome);
    this.nomeClienteUltimoPedidoHidratado = c.nome.trim();
    this.clientesAutocomplete.set([]);
    this.autocompleteClienteAberto.set(false);
  }

  async carregarProdutos() {
    try {
      const res = await firstValueFrom(this.http.get<any[]>(`${API_URL}/produtos`));
      const list = Array.isArray(res) ? res : [];
      const novoPedido = !this.pedidoParaEditarId()?.trim();
      const filtrados = novoPedido
        ? list.filter((pr) => Number(pr.estoque_atual ?? 0) > 0)
        : list;
      this.produtos = filtrados.map((pr) => ({
        id: String(pr.id_prod ?? pr.id),
        nome: pr.nome,
        preco: Number(pr.preco ?? 0),
        estoque_atual: Math.max(0, Math.floor(Number(pr.estoque_atual ?? 0))),
      }));
    } catch {
      this.produtos = [];
    }
  }

  onPesquisaFocus() {
    if (this.somenteLeitura()) return;
    this.mostrarListaProdutos.set(true);
  }

  onPesquisaBlur() {
    setTimeout(() => this.mostrarListaProdutos.set(false), 200);
  }

  selecionarProduto(pr: ProdutoOption) {
    this.pesquisaProduto.set(pr.nome);
    this._produtoSelecionado = pr;
    this.mostrarListaProdutos.set(false);
  }

  private _produtoSelecionado: ProdutoOption | null = null;

  adicionarItem() {
    if (this.somenteLeitura()) return;
    const pr = this._produtoSelecionado;
    if (!pr) {
      void MessageService.validationError('Selecione um produto da lista');
      return;
    }

    const qty = this.quantidadeAdd();
    if (!Number.isFinite(qty) || qty < 1) {
      void MessageService.validationError('Quantidade invalida');
      return;
    }

    const itens = [...this.itensCarrinho()];
    const existente = itens.find((i) => i.produtoId === pr.id);
    if (existente) {
      existente.quantidade += qty;
    } else {
      itens.push({ produtoId: pr.id, nome: pr.nome, quantidade: qty, preco_unitario: pr.preco });
    }
    this.itensCarrinho.set(itens);

    this.pesquisaProduto.set('');
    this.quantidadeAdd.set(1);
    this._produtoSelecionado = null;
  }

  removerItem(index: number) {
    if (this.somenteLeitura()) return;
    const itens = [...this.itensCarrinho()];
    itens.splice(index, 1);
    this.itensCarrinho.set(itens);
  }

  onQuantidadeItemChange(index: number, value: unknown): void {
    if (this.somenteLeitura()) return;
    const itens = [...this.itensCarrinho()];
    if (index < 0 || index >= itens.length) return;

    if (value === '' || value === null || value === undefined) {
      return;
    }
    const n = Number(value);
    if (!Number.isFinite(n)) return;
    const q = Math.max(1, Math.floor(n));
    if (q === itens[index].quantidade) return;
    itens[index] = { ...itens[index], quantidade: q };
    this.itensCarrinho.set(itens);
  }

  onQuantidadeItemBlur(index: number, ev: Event): void {
    if (this.somenteLeitura()) return;
    const el = ev.target as HTMLInputElement | null;
    const raw = el?.value?.trim() ?? '';
    if (raw !== '') return;
    const itens = [...this.itensCarrinho()];
    if (index < 0 || index >= itens.length) return;
    itens[index] = { ...itens[index], quantidade: 1 };
    this.itensCarrinho.set(itens);
  }

  selecionarFormaPagamento(forma: FormaPagamento) {
    if (this.somenteLeitura()) return;
    this.formaPagamento.set(forma);
  }

  coerceDescontoInput(value: unknown): number {
    if (value === '' || value === null || value === undefined) return 0;
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, n);
  }

  private clienteSelecionadoValido(): boolean {
    const id = this.clienteSelecionadoId().trim();
    const num = Number(id);
    if (!id || !Number.isFinite(num) || num <= 0) {
      void MessageService.validationError('Selecione um cliente');
      return false;
    }
    return true;
  }

  async confirmarPagamento() {
    if (this.bloqueadoSomenteLeitura()) return;
    if (this.itensCarrinho().length === 0) {
      void MessageService.validationError('Adicione ao menos um item');
      return;
    }
    if (!this.clienteSelecionadoValido()) return;

    if (!this.pagamentoDetalheAberto()) {
      this.pagamentoDetalheAberto.set(true);
      return;
    }

    const ok = await MessageService.confirmAction('Confirmar pagamento desta venda?', {
      title: 'Confirmar Pagamento',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#22c55e',
    });
    if (!ok) return;

    await this.criarPedidoAPI(PedidoStatus.Pago);
  }

  abrirModalPedido() {
    if (this.bloqueadoSomenteLeitura()) return;
    if (this.itensCarrinho().length === 0) {
      void MessageService.validationError('Adicione ao menos um item');
      return;
    }
    if (!this.clienteSelecionadoValido()) return;
    // Nova venda: campo em branco para escolher data. Edição: manter data vinda do GET /pedidos/:id.
    if (!this.pedidoParaEditarId()?.trim()) {
      this.dataEntrega.set('');
    }
    this.mostraModalPedido.set(true);
  }

  fecharModalPedido() {
    this.mostraModalPedido.set(false);
  }

  async salvarPedido() {
    if (this.bloqueadoSomenteLeitura()) return;
    if (!this.dataEntrega()) {
      void MessageService.validationError('Informe a data de entrega');
      return;
    }
    if (!this.clienteSelecionadoValido()) return;
    this.fecharModalPedido();
    await this.criarPedidoAPI(PedidoStatus.Aberto);
  }

  private async criarPedidoAPI(status: PedidoStatus) {
    if (this.somenteLeitura()) return;

    const user = this.auth.currentUser();
    const uid = user?.id?.trim();
    if (!uid) {
      void MessageService.validationError('Sessao invalida. Faca login novamente.');
      return;
    }

    const substituirPedidoId = this.pedidoParaEditarId()?.trim() || null;
    const clienteId = this.clienteSelecionadoId() ? Number(this.clienteSelecionadoId()) : null;
    const itens = this.itensCarrinho();

    try {
      this.salvando.set(true);

      const body: any = {
        usuarioId: uid,
        total: 0,
        desconto: this.descontoAplicado(),
        status,
        itens: [],
      };
      if (clienteId && Number.isFinite(clienteId) && clienteId > 0) {
        body.clienteId = clienteId;
      }
      const entrega = this.dataEntrega();
      if (entrega) {
        body.data_entrega = entrega;
      }

      const criado = await firstValueFrom(this.http.post<any>(`${API_URL}/pedidos`, body));
      const pedidoId = String(criado?.id ?? '');
      if (!pedidoId) throw new Error('Resposta invalida ao criar venda');

      for (const item of itens) {
        await firstValueFrom(
          this.http.post(`${API_URL}/itens-pedido`, {
            pedidoId,
            produtoId: item.produtoId.trim(),
            quantidade: item.quantidade,
            preco_unitario: item.preco_unitario,
          })
        );
      }

      const codigoGerado = String(criado?.codigo ?? '').trim();
      const refPedido = codigoGerado || pedidoId;
      let msgSucesso: string;
      if (substituirPedidoId) {
        msgSucesso = `Pedido #${refPedido} alterado com sucesso`;
      } else if (status === PedidoStatus.Pago) {
        msgSucesso = `Venda confirmada com sucesso! Código do pedido: ${refPedido}`;
      } else {
        msgSucesso = `Pedido cadastrado com sucesso. Código gerado: ${refPedido}`;
      }
      await MessageService.success(msgSucesso);

      if (substituirPedidoId) {
        try {
          await firstValueFrom(this.http.delete(`${API_URL}/pedidos/${encodeURIComponent(substituirPedidoId)}`));
        } catch (delErr) {
          console.error(delErr);
          void MessageService.error(
            'Registro concluido, mas o pedido anterior nao foi removido automaticamente. Exclua-o na lista se necessario.'
          );
        }
      }

      this.novaVenda();
      if (this.embedded()) {
        this.pedidoRegistrado.emit();
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      if (isHandledValidationError(error)) return;
      const message = MessageService.extractErrorMessage(error, 'Erro ao salvar venda');
      void MessageService.error(message);
    } finally {
      this.salvando.set(false);
    }
  }

  novaVenda() {
    this.limparMetaVisualizacaoPedido();
    this.nomeClienteUltimoPedidoHidratado = '';
    this.itensCarrinho.set([]);
    this.clienteBusca.set('');
    this.clienteSelecionadoId.set('');
    this.clientesAutocomplete.set([]);
    this.autocompleteClienteAberto.set(false);
    this.pesquisaProduto.set('');
    this.quantidadeAdd.set(1);
    this.formaPagamento.set('dinheiro');
    this.pagamentoDetalheAberto.set(false);
    this.descontoValor.set(0);
    this.pedidoDescontoLeitura.set(0);
    this._produtoSelecionado = null;
  }
}
