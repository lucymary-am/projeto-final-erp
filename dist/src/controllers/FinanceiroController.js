import { AppError } from "../errors/AppErrors.js";
export class FinanceiroController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(req, res) {
        try {
            const financeiro = await this.service.create(req.body);
            return res.status(201).json(financeiro);
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    async findAll(_req, res) {
        const lista = await this.service.findAll();
        return res.json(lista);
    }
    async findById(req, res) {
        try {
            const id = this.getIdParam(req);
            const financeiro = await this.service.findById(id);
            return res.json(financeiro);
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    async update(req, res) {
        try {
            const id = this.getIdParam(req);
            const financeiro = await this.service.update(id, req.body);
            return res.json(financeiro);
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    async pagar(req, res) {
        try {
            const id = this.getIdParam(req);
            const financeiro = await this.service.pagar(id);
            return res.json(financeiro);
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    async delete(req, res) {
        try {
            const id = this.getIdParam(req);
            await this.service.delete(id);
            return res.status(204).send();
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    getIdParam(req) {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            throw new AppError("ID inválido", 400);
        }
        return id;
    }
    handleError(error, res) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: "Erro interno" });
    }
}
//# sourceMappingURL=FinanceiroController.js.map