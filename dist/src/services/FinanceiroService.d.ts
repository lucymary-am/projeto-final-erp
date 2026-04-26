import type { DataSource } from "typeorm";
import { Financeiro } from "../entities/Financeiro.js";
import type { CreateFinanceiroDTO, UpdateFinanceiroDTO } from "../dtos/FinanceiroDTO.js";
export declare class FinanceiroService {
    private financeiroRepository;
    constructor(dataSource: DataSource);
    createFinanceiro(data: CreateFinanceiroDTO): Promise<Financeiro[]>;
    findAll(): Promise<Financeiro[]>;
    findById(id: string): Promise<Financeiro>;
    updateFinanceiro(id: string, data: UpdateFinanceiroDTO): Promise<Financeiro>;
    deleteFinanceiro(id: string): Promise<void>;
    pagarFinanceiro(id: string): Promise<Financeiro>;
}
//# sourceMappingURL=FinanceiroService.d.ts.map