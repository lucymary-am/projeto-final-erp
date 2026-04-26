import { Financeiro } from "../entities/Financeiro.js";
export declare class FinanceiroService {
    private financeiroRepository;
    create(data: Partial<Financeiro>): Promise<Financeiro>;
    findAll(): Promise<Financeiro[]>;
    findById(id: string): Promise<Financeiro>;
    update(id: string, data: Partial<Financeiro>): Promise<Financeiro>;
    delete(id: string): Promise<void>;
    pagar(id: string): Promise<Financeiro>;
}
//# sourceMappingURL=FinanceiroService.d.ts.map