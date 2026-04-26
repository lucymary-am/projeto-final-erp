import type { DataSource } from "typeorm";
import { Cliente } from "../entities/Cliente.js";
export type CreateClienteDTO = {
    nome: string;
    cpf_cnpj: string;
    email?: string;
    telefone?: string;
};
export type UpdateClienteDTO = Partial<CreateClienteDTO>;
export declare class ClienteService {
    private clienteRepository;
    constructor(dataSource: DataSource);
    getById(id: number): Promise<Cliente | null>;
    findAll(): Promise<Cliente[]>;
    getByCpfCnpj(cpfCnpj: string): Promise<Cliente | null>;
    createCliente(data: CreateClienteDTO): Promise<Cliente[]>;
    updateCliente(id: number, data: UpdateClienteDTO): Promise<Cliente>;
    deleteCliente(id: number): Promise<void>;
}
//# sourceMappingURL=ClienteService.d.ts.map