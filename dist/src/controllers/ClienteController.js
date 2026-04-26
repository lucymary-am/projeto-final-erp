import { ClienteService } from "../services/ClienteService.js";
export class ClienteController {
    clienteService = new ClienteService();
    async create(req, res) {
        try {
            const cliente = await this.clienteService.create(req.body);
            return res.status(201).json(cliente);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async findAll(req, res) {
        try {
            const clientes = await this.clienteService.findAll();
            return res.status(200).json(clientes);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async findById(req, res) {
        try {
            const id = Number(req.params.id);
            const cliente = await this.clienteService.findById(id);
            return res.status(200).json(cliente);
        }
        catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const clienteAtualizado = await this.clienteService.update(id, req.body);
            return res.status(200).json(clienteAtualizado);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await this.clienteService.delete(id);
            return res.status(204).send();
        }
        catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
}
//# sourceMappingURL=ClienteController.js.map