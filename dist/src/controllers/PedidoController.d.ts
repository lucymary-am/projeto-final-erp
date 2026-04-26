import { Request, Response } from "express";
import { PedidoService } from "../services/PedidoService.js";
export declare class PedidoController {
    private pedidoService;
    constructor(pedidoService: PedidoService);
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    private handleError;
}
//# sourceMappingURL=PedidoController.d.ts.map