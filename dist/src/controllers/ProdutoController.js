import { AppError } from "../errors/AppErrors.js";
export default class ProdutoController {
    produtoService;
    constructor(produtoService) {
        this.produtoService = produtoService;
    }
    async findAllProduto(_req, res) {
        const produtos = await this.produtoService.findAll();
        return res.status(200).json(produtos);
    }
    async findProdutoById(req, res) {
        const produto = await this.produtoService.getById(req.params.id);
        if (!produto) {
            throw new AppError("Produto nao encontrado!", 404);
        }
        return res.status(200).json(produto);
    }
    async createProduto(req, res) {
        const produto = await this.produtoService.createProduto(req.body);
        return res.status(201).json(produto);
    }
    async updateProduto(req, res) {
        const produto = await this.produtoService.updateProduto(req.params.id, req.body);
        return res.status(200).json(produto);
    }
    async deleteProduto(req, res) {
        await this.produtoService.deleteProduto(req.params.id);
        return res.status(204).send();
    }
}
//# sourceMappingURL=ProdutoController.js.map