import type { DataSource } from "typeorm";
import { Produto } from "../entities/Produto.js";
export type CreateProdutoDTO = {
    nome: string;
    descricao?: string | null;
    codigo: string;
    preco: number;
    estoque_atual?: number;
    estoque_minimo: number;
    estoque_maximo?: number | null;
    ativo?: boolean;
    categoriaId?: string;
};
export type UpdateProdutoDTO = Partial<CreateProdutoDTO>;
export declare class ProdutoService {
    private produtoRepo;
    private categoriaRepo;
    constructor(dataSource: DataSource);
    private validateEstoqueLimites;
    getById(id: string | number): Promise<Produto | null>;
    findAll(): Promise<Produto[]>;
    getByCodigo(codigo: string): Promise<Produto | null>;
    createProduto(data: CreateProdutoDTO): Promise<Produto>;
    updateProduto(id: string | number, data: UpdateProdutoDTO): Promise<Produto>;
    deleteProduto(id: string | number): Promise<void>;
}
//# sourceMappingURL=ProdutoService.d.ts.map