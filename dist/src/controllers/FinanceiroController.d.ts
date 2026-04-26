import { Request, Response } from "express";
import { FinanceiroService } from "../services/FinanceiroService.js";
export declare class FinanceiroController {
    private service;
    constructor(service: FinanceiroService);
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    pagar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    private getIdParam;
    private handleError;
}
//# sourceMappingURL=FinanceiroController.d.ts.map