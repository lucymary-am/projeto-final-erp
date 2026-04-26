import { Pedido } from "../entities/Pedido.js";
import { Cliente } from "../entities/Cliente.js";
import { Usuario } from "../entities/Usuario.js";
import { ItemPedido } from "../entities/ItemPedido.js";
import { Produto } from "../entities/Produto.js";
import { AppError } from "../errors/AppErrors.js";
export class PedidoService {
    dataSource;
    pedidoRepo;
    clienteRepo;
    usuarioRepo;
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.pedidoRepo = dataSource.getRepository(Pedido);
        this.clienteRepo = dataSource.getRepository(Cliente);
        this.usuarioRepo = dataSource.getRepository(Usuario);
    }
    num(n) {
        const x = Number(n);
        return Number.isFinite(x) ? x : 0;
    }
    totalFromItensPayload(itens) {
        if (!Array.isArray(itens) || itens.length === 0)
            return null;
        let sum = 0;
        for (const it of itens) {
            if (it && typeof it === "object") {
                const o = it;
                sum += this.num(o.quantidade) * this.num(o.preco_unitario ?? o.preco);
            }
        }
        return sum;
    }
    async ajustarEstoqueProduto(em, produtoId, delta) {
        const produtoRepo = em.getRepository(Produto);
        const produto = await produtoRepo.findOne({
            where: { id_prod: produtoId },
            lock: { mode: "pessimistic_write" },
        });
        if (!produto)
            throw new AppError("Produto não encontrado", 404);
        const atual = Math.trunc(this.num(produto.estoque_atual));
        const novo = atual + delta;
        if (novo < 0) {
            throw new AppError("Estoque insuficiente para concluir a operação", 400);
        }
        produto.estoque_atual = novo;
        await produtoRepo.save(produto);
    }
    async baixarEstoqueItensPedido(em, itens) {
        for (const line of itens) {
            const produtoId = line.produto?.id_prod;
            if (!produtoId)
                continue;
            await this.ajustarEstoqueProduto(em, produtoId, -line.quantidade);
        }
    }
    async restaurarEstoqueItensPedido(em, itens) {
        for (const line of itens) {
            const produtoId = line.produto?.id_prod;
            if (!produtoId)
                continue;
            await this.ajustarEstoqueProduto(em, produtoId, line.quantidade);
        }
    }
    async create(data) {
        return await this.dataSource.transaction(async (em) => {
            const clienteRepo = em.getRepository(Cliente);
            const usuarioRepo = em.getRepository(Usuario);
            const pedidoRepo = em.getRepository(Pedido);
            const cliente = await clienteRepo.findOneBy({ id: data.clienteId });
            if (!cliente)
                throw new AppError("Cliente não encontrado", 404);
            const usuario = await usuarioRepo.findOneBy({ id_user: data.usuarioId });
            if (!usuario)
                throw new AppError("Usuário não encontrado", 404);
            const fromItens = this.totalFromItensPayload(data.itens);
            const total = fromItens !== null ? fromItens : this.num(data.total);
            const pedido = pedidoRepo.create({
                cliente,
                usuario,
                total,
                status: data.status ?? "aberto",
                itens: data.itens,
            });
            const saved = await pedidoRepo.save(pedido);
            if (saved.status === "pago") {
                const fullItens = await em.find(ItemPedido, {
                    where: { pedido: { id: saved.id } },
                    relations: { produto: true },
                });
                if (fullItens.length > 0) {
                    await this.baixarEstoqueItensPedido(em, fullItens);
                }
            }
            const result = await pedidoRepo.findOne({
                where: { id: saved.id },
                relations: ["cliente", "usuario", "itens"],
            });
            if (!result)
                throw new AppError("Pedido não encontrado após criação", 500);
            return result;
        });
    }
    async findAll() {
        return await this.pedidoRepo.find({
            relations: ["cliente", "usuario", "itens"],
        });
    }
    async findById(id) {
        const pedido = await this.pedidoRepo.findOne({
            where: { id },
            relations: ["cliente", "usuario", "itens"],
        });
        if (!pedido)
            throw new AppError("Pedido não encontrado", 404);
        return pedido;
    }
    async updateStatus(id, status) {
        if (!["aberto", "pago", "cancelado"].includes(status)) {
            throw new AppError("Status inválido", 400);
        }
        return await this.dataSource.transaction(async (em) => {
            const pedidoRepo = em.getRepository(Pedido);
            const pedido = await pedidoRepo.findOne({
                where: { id },
                relations: { itens: { produto: true } },
                lock: { mode: "pessimistic_write" },
            });
            if (!pedido)
                throw new AppError("Pedido não encontrado", 404);
            const anterior = pedido.status;
            if (anterior === status) {
                const unchanged = await pedidoRepo.findOne({
                    where: { id },
                    relations: ["cliente", "usuario", "itens"],
                });
                if (!unchanged)
                    throw new AppError("Pedido não encontrado", 404);
                return unchanged;
            }
            if (anterior === "cancelado") {
                throw new AppError("Pedido cancelado não pode ter status alterado", 400);
            }
            if (anterior === "aberto" && status === "pago") {
                await this.baixarEstoqueItensPedido(em, pedido.itens ?? []);
            }
            else if (anterior === "pago" && (status === "aberto" || status === "cancelado")) {
                await this.restaurarEstoqueItensPedido(em, pedido.itens ?? []);
            }
            pedido.status = status;
            await pedidoRepo.save(pedido);
            const atualizado = await pedidoRepo.findOne({
                where: { id },
                relations: ["cliente", "usuario", "itens"],
            });
            if (!atualizado)
                throw new AppError("Pedido não encontrado", 404);
            return atualizado;
        });
    }
    async delete(id) {
        await this.dataSource.transaction(async (em) => {
            const pedidoRepo = em.getRepository(Pedido);
            const pedido = await pedidoRepo.findOne({
                where: { id },
                relations: { itens: { produto: true } },
                lock: { mode: "pessimistic_write" },
            });
            if (!pedido)
                throw new AppError("Pedido não encontrado", 404);
            if (pedido.status === "pago") {
                await this.restaurarEstoqueItensPedido(em, pedido.itens ?? []);
            }
            await pedidoRepo.remove(pedido);
        });
    }
}
//# sourceMappingURL=PedidoService.js.map