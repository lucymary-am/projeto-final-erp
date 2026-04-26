import { AppError } from "../errors/AppErrors.js";
export default class ClienteController {
    clienteService;
    constructor(clienteService) {
        this.clienteService = clienteService;
    }
    async createCliente(req, res) {
        const cliente = await this.clienteService.createCliente(req.body);
        return res.status(201).json(cliente);
    }
    async findAllCliente(_req, res) {
        const clientes = await this.clienteService.findAll();
        return res.status(200).json(clientes);
    }
    async findClienteById(req, res) {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            throw new AppError("ID invalido", 400);
        }
        const cliente = await this.clienteService.getById(id);
        if (!cliente) {
            throw new AppError("Cliente nao encontrado!", 404);
        }
        return res.status(200).json(cliente);
    }
    async updateCliente(req, res) {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            throw new AppError("ID invalido", 400);
        }
        const clienteAtualizado = await this.clienteService.updateCliente(id, req.body);
        return res.status(200).json(clienteAtualizado);
    }
    async deleteCliente(req, res) {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            throw new AppError("ID invalido", 400);
        }
        await this.clienteService.deleteCliente(id);
        return res.status(204).send();
    }
}
//# sourceMappingURL=ClienteController.js.map