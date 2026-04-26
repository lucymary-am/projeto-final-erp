import { Request, Response } from "express";
import { MovimentacaoEstoqueService } from "../services/MovimentacaoService.js";
export declare class MovimentacaoEstoqueController {
    private service;
    constructor(service: MovimentacaoEstoqueService);
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    private getIdParam;
    private handleError;
}
//# sourceMappingURL=MovimentacaoController.d.ts.map