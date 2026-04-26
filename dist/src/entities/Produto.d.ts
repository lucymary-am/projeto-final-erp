import { Categoria } from "./Categoria.js";
export declare class Produto {
    id_prod: string;
    nome: string;
    descricao: string | null;
    codigo: string;
    preco: number;
    estoque_atual: number;
    estoque_minimo: number;
    estoque_maximo: number | null;
    categoria: Categoria;
    ativo: boolean;
    created_at: Date;
    updated_at: Date;
}
//# sourceMappingURL=Produto.d.ts.map