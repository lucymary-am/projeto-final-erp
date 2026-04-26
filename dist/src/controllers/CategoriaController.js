import { AppError } from "../errors/AppErrors.js";
export default class CategoriaController {
    categoriaService;
    constructor(categoriaService) {
        this.categoriaService = categoriaService;
    }
    async findAllCategoria(_req, res) {
        const categorias = await this.categoriaService.findAll();
        return res.status(200).json(categorias);
    }
    async findCategoriaById(req, res) {
        const categoria = await this.categoriaService.getById(req.params.id);
        if (!categoria) {
            throw new AppError("Categoria nao encontrada!", 404);
        }
        return res.status(200).json(categoria);
    }
    async createCategoria(req, res) {
        const categoria = await this.categoriaService.createCategoria(req.body);
        return res.status(201).json(categoria);
    }
    async updateCategoria(req, res) {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            throw new AppError("Categoria id inválido", 400);
        }
        const categoria = await this.categoriaService.updateCategoria(id, req.body);
        return res.status(200).json(categoria);
    }
    async deleteCategoria(req, res) {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            throw new AppError("Categoria id inválido", 400);
        }
        await this.categoriaService.deleteCategoria(id);
        return res.status(204).send();
    }
}
//# sourceMappingURL=CategoriaController.js.map