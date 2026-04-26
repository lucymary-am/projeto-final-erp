import { AppError } from "../errors/AppErrors.js";
import { itemPedidoIdParamSchema, listItemPedidoQuerySchema, } from "../dtos/ItemPedidoDTO.js";
export class ItemPedidoController {
    itemPedidoService;
    constructor(itemPedidoService) {
        this.itemPedidoService = itemPedidoService;
    }
    async create(req, res) {
        try {
            const data = req.body;
            const item = await this.itemPedidoService.create(data);
            return res.status(201).json(item);
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    async findAll(req, res) {
        try {
            const queryParsed = listItemPedidoQuerySchema.safeParse(req.query);
            if (!queryParsed.success) {
                return res.status(400).json({
                    message: "Parâmetros de consulta inválidos",
                    errors: queryParsed.error.issues,
                });
            }
            const itens = await this.itemPedidoService.findAll(queryParsed.data.pedidoId);
            return res.json(itens);
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    async findById(req, res) {
        try {
            const id = this.parseIdParam(req.params.id);
            const item = await this.itemPedidoService.findById(id);
            return res.json(item);
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    async update(req, res) {
        try {
            const id = this.parseIdParam(req.params.id);
            const data = req.body;
            const item = await this.itemPedidoService.update(id, data);
            return res.json(item);
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    async delete(req, res) {
        try {
            const id = this.parseIdParam(req.params.id);
            await this.itemPedidoService.delete(id);
            return res.status(204).send();
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    parseIdParam(raw) {
        const single = Array.isArray(raw) ? raw[0] : raw;
        const parsed = itemPedidoIdParamSchema.safeParse(single);
        if (!parsed.success) {
            throw new AppError("ID inválido", 400);
        }
        return parsed.data;
    }
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
//# sourceMappingURL=ItemPedidoController.js.map