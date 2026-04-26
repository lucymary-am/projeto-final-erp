import { AppError } from "../errors/AppErrors.js";
export class PedidoController {
    pedidoService;
    constructor(pedidoService) {
        this.pedidoService = pedidoService;
    }
    async create(req, res) {
        try {
            const pedido = await this.pedidoService.create(req.body);
            return res.status(201).json(pedido);
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    async findAll(req, res) {
        try {
            const pedidos = await this.pedidoService.findAll();
            return res.json(pedidos);
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    async findById(req, res) {
        try {
            const id = req.params.id;
            if (!id || typeof id !== "string") {
                throw new AppError("ID inválido", 400);
            }
            const pedido = await this.pedidoService.findById(id);
            return res.json(pedido);
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    async updateStatus(req, res) {
        try {
            const id = req.params.id;
            if (!id || typeof id !== "string") {
                throw new AppError("ID inválido", 400);
            }
            const { status } = req.body;
            if (!status) {
                throw new AppError("Status é obrigatório", 400);
            }
            const pedido = await this.pedidoService.updateStatus(id, status);
            return res.json(pedido);
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    async delete(req, res) {
        try {
            const id = req.params.id;
            if (!id || typeof id !== "string") {
                throw new AppError("ID inválido", 400);
            }
            await this.pedidoService.delete(id);
            return res.status(204).send();
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    // Tratamento padrão de erro (reutilizável)
    handleError(error, res) {
        console.error(error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                message: error.message,
                details: error.details,
            });
        }
        return res.status(500).json({
            message: "Erro interno",
        });
    }
}
//# sourceMappingURL=PedidoController.js.map