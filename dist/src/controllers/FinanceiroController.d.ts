import type { Request, Response } from "express";
import type { FinanceiroService } from "../services/FinanceiroService.js";
export default class FinanceiroController {
    private service;
    constructor(service: FinanceiroService);
    createFinanceiro(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findAllFinanceiro(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findFinanceiroById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateFinanceiro(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    pagarFinanceiro(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteFinanceiro(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    private getIdParam;
}
//# sourceMappingURL=FinanceiroController.d.ts.map