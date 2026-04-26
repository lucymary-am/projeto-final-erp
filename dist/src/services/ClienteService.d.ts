import { Cliente } from "../entities/Cliente.js";
export declare class ClienteService {
    private clienteRepository;
    create(data: Partial<Cliente>): Promise<Cliente>;
    findAll(): Promise<Cliente[]>;
    findById(id: number): Promise<Cliente>;
    update(id: number, data: Partial<Cliente>): Promise<Cliente>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=ClienteService.d.ts.map