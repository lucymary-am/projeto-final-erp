import { AppError } from "../errors/AppErrors.js";
export default class FinanceiroController {
    service;
    constructor(service) {
        this.service = service;
    }
    async createFinanceiro(req, res) {
        const financeiro = await this.service.createFinanceiro(req.body);
        return res.status(201).json(financeiro);
    }
    async findAllFinanceiro(_req, res) {
        const lista = await this.service.findAll();
        return res.json(lista);
    }
    async findFinanceiroById(req, res) {
        const id = this.getIdParam(req);
        const financeiro = await this.service.findById(id);
        return res.json(financeiro);
    }
    async updateFinanceiro(req, res) {
        const id = this.getIdParam(req);
        const financeiro = await this.service.updateFinanceiro(id, req.body);
        return res.json(financeiro);
    }
    async pagarFinanceiro(req, res) {
        const id = this.getIdParam(req);
        const financeiro = await this.service.pagarFinanceiro(id);
        return res.json(financeiro);
    }
    async deleteFinanceiro(req, res) {
        const id = this.getIdParam(req);
        await this.service.deleteFinanceiro(id);
        return res.status(204).send();
    }
    getIdParam(req) {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            throw new AppError("ID inválido", 400);
        }
        return id;
    }
}
//# sourceMappingURL=FinanceiroController.js.map