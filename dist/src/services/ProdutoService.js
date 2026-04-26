import { Produto } from "../entities/Produto.js";
import { Categoria } from "../entities/Categoria.js";
import { AppError } from "../errors/AppErrors.js";
export class ProdutoService {
    produtoRepo;
    categoriaRepo;
    constructor(dataSource) {
        this.produtoRepo = dataSource.getRepository(Produto);
        this.categoriaRepo = dataSource.getRepository(Categoria);
    }
    validateEstoqueLimites(estoqueAtual, estoqueMinimo, estoqueMaximo) {
        if (estoqueMaximo !== null && estoqueMinimo > estoqueMaximo) {
            throw new AppError("Estoque minimo nao pode ser maior que o estoque maximo!", 400);
        }
        if (estoqueAtual < estoqueMinimo) {
            throw new AppError("Estoque atual nao pode ser menor que o estoque minimo!", 400);
        }
        if (estoqueMaximo !== null && estoqueAtual > estoqueMaximo) {
            throw new AppError("Estoque atual nao pode ser maior que o estoque maximo!", 400);
        }
    }
    async getById(id) {
        return await this.produtoRepo.findOne({
            where: { id_prod: id },
            relations: { categoria: true },
        });
    }
    async findAll() {
        return await this.produtoRepo.find({
            relations: { categoria: true },
        });
    }
    async getByCodigo(codigo) {
        return await this.produtoRepo.findOne({
            where: { codigo },
            relations: { categoria: true },
        });
    }
    async createProduto(data) {
        const codigoEmUso = await this.getByCodigo(data.codigo);
        if (codigoEmUso) {
            throw new AppError("Codigo de produto ja cadastrado!", 409);
        }
        let categoria = null;
        if (data.categoriaId !== undefined) {
            categoria = await this.categoriaRepo.findOneBy({ id: data.categoriaId });
            if (!categoria) {
                throw new AppError("Categoria nao encontrada!", 404);
            }
        }
        const novoProdutoData = {
            nome: data.nome,
            descricao: data.descricao ?? null,
            codigo: data.codigo,
            preco: data.preco,
            estoque_atual: data.estoque_atual ?? 0,
            estoque_minimo: data.estoque_minimo,
            estoque_maximo: data.estoque_maximo ?? null,
            ativo: data.ativo ?? true,
            ...(categoria ? { categoria } : {}),
        };
        this.validateEstoqueLimites(novoProdutoData.estoque_atual, novoProdutoData.estoque_minimo, novoProdutoData.estoque_maximo);
        const novoProduto = this.produtoRepo.create(novoProdutoData);
        return await this.produtoRepo.save(novoProduto);
    }
    async updateProduto(id, data) {
        const produto = await this.getById(id);
        if (!produto) {
            throw new AppError("Produto nao encontrado!", 404);
        }
        if (data.codigo && data.codigo !== produto.codigo) {
            const codigoEmUso = await this.getByCodigo(data.codigo);
            if (codigoEmUso) {
                throw new AppError("Codigo de produto ja cadastrado!", 409);
            }
        }
        if (data.categoriaId !== undefined) {
            const categoria = await this.categoriaRepo.findOneBy({ id: data.categoriaId });
            if (!categoria) {
                throw new AppError("Categoria nao encontrada!", 404);
            }
            produto.categoria = categoria;
        }
        const produtoAtualizado = {
            nome: data.nome ?? produto.nome,
            descricao: data.descricao ?? produto.descricao,
            codigo: data.codigo ?? produto.codigo,
            preco: data.preco ?? produto.preco,
            estoque_atual: data.estoque_atual ?? produto.estoque_atual,
            estoque_minimo: data.estoque_minimo ?? produto.estoque_minimo,
            estoque_maximo: data.estoque_maximo ?? produto.estoque_maximo,
            ativo: data.ativo ?? produto.ativo,
        };
        this.validateEstoqueLimites(produtoAtualizado.estoque_atual, produtoAtualizado.estoque_minimo, produtoAtualizado.estoque_maximo);
        Object.assign(produto, produtoAtualizado);
        return await this.produtoRepo.save(produto);
    }
    async deleteProduto(id) {
        const result = await this.produtoRepo.delete(id);
        if (result.affected === 0) {
            throw new AppError("Produto nao encontrado!", 404);
        }
    }
}
//# sourceMappingURL=ProdutoService.js.map