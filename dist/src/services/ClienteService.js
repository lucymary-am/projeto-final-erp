import { Cliente } from "../entities/Cliente.js";
import { AppError } from "../errors/AppErrors.js";
export class ClienteService {
    clienteRepository;
    constructor(dataSource) {
        this.clienteRepository = dataSource.getRepository(Cliente);
    }
    async getById(id) {
        return await this.clienteRepository.findOne({
            where: { id },
            relations: { pedidos: true },
        });
    }
    async findAll() {
        return await this.clienteRepository.find({
            relations: { pedidos: true },
        });
    }
    async getByCpfCnpj(cpfCnpj) {
        return await this.clienteRepository.findOne({
            where: { cpf_cnpj: cpfCnpj },
        });
    }
    async createCliente(data) {
        const clienteExistente = await this.getByCpfCnpj(data.cpf_cnpj);
        if (clienteExistente) {
            throw new AppError("CPF/CNPJ ja cadastrado!", 409);
        }
        const cliente = this.clienteRepository.create({
            nome: data.nome,
            cpf_cnpj: data.cpf_cnpj,
            email: data.email,
            telefone: data.telefone,
        });
        return await this.clienteRepository.save(cliente);
    }
    async updateCliente(id, data) {
        const cliente = await this.getById(id);
        if (!cliente) {
            throw new AppError("Cliente nao encontrado!", 404);
        }
        if (data.cpf_cnpj && data.cpf_cnpj !== cliente.cpf_cnpj) {
            const cpfCnpjEmUso = await this.getByCpfCnpj(data.cpf_cnpj);
            if (cpfCnpjEmUso) {
                throw new AppError("CPF/CNPJ ja cadastrado!", 409);
            }
        }
        Object.assign(cliente, {
            nome: data.nome ?? cliente.nome,
            cpf_cnpj: data.cpf_cnpj ?? cliente.cpf_cnpj,
            email: data.email ?? cliente.email,
            telefone: data.telefone ?? cliente.telefone,
        });
        return await this.clienteRepository.save(cliente);
    }
    async deleteCliente(id) {
        const result = await this.clienteRepository.delete(id);
        if (result.affected === 0) {
            throw new AppError("Cliente nao encontrado!", 404);
        }
    }
}
//# sourceMappingURL=ClienteService.js.map