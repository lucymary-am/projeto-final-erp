import { Categoria } from "../entities/Categoria.js";
import { AppError } from "../errors/AppErrors.js";
export class CategoriaService {
    categoriaRepo;
    constructor(dataSource) {
        this.categoriaRepo = dataSource.getRepository(Categoria);
    }
    async getById(id) {
        return await this.categoriaRepo.findOne({
            where: { id: id },
            relations: { produtos: true },
        });
    }
    async findAll() {
        return await this.categoriaRepo.find({
            relations: { produtos: true },
        });
    }
    async getByNome(nome) {
        return await this.categoriaRepo.findOne({
            where: { nome },
            relations: { produtos: true },
        });
    }
    async createCategoria(data) {
        const existente = await this.getByNome(data.nome);
        if (existente) {
            throw new AppError("Categoria ja cadastrada!", 409);
        }
        const categoria = this.categoriaRepo.create({
            nome: data.nome,
            ...(data.descricao !== undefined ? { descricao: data.descricao } : {}),
        });
        return await this.categoriaRepo.save(categoria);
    }
    async updateCategoria(id, data) {
        const categoria = await this.getById(id);
        if (!categoria) {
            throw new AppError("Categoria nao encontrada!", 404);
        }
        if (data.nome && data.nome !== categoria.nome) {
            const existente = await this.getByNome(data.nome);
            if (existente) {
                throw new AppError("Categoria ja cadastrada!", 409);
            }
        }
        Object.assign(categoria, {
            nome: data.nome ?? categoria.nome,
            ...(data.descricao !== undefined ? { descricao: data.descricao } : {}),
        });
        return await this.categoriaRepo.save(categoria);
    }
    async deleteCategoria(id) {
        const categoria = await this.categoriaRepo.findOneBy({ id });
        if (!categoria) {
            throw new AppError("Categoria não encontrada", 404);
        }
        await this.categoriaRepo.delete(id);
    }
}
//# sourceMappingURL=CategoriaService.js.map