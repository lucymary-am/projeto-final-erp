import type { DataSource } from "typeorm";
import { Categoria } from "../entities/Categoria.js";
export type CreateCategoriaDTO = {
    nome: string;
    descricao?: string;
};
export type UpdateCategoriaDTO = Partial<CreateCategoriaDTO>;
export declare class CategoriaService {
    private categoriaRepo;
    constructor(dataSource: DataSource);
    getById(id: string | number): Promise<Categoria | null>;
    findAll(): Promise<Categoria[]>;
    getByNome(nome: string): Promise<Categoria | null>;
    createCategoria(data: CreateCategoriaDTO): Promise<Categoria>;
    updateCategoria(id: string, data: UpdateCategoriaDTO): Promise<Categoria>;
    deleteCategoria(id: string): Promise<void>;
}
//# sourceMappingURL=CategoriaService.d.ts.map