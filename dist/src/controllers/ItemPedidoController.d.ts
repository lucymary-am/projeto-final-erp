import { Request, Response } from "express";
import { ItemPedidoService } from "../services/ItemPedidoService.js";
export declare class ItemPedidoController {
    private itemPedidoService;
    constructor(itemPedidoService: ItemPedidoService);
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    private parseIdParam;
    private handleError;
}
//# sourceMappingURL=ItemPedidoController.d.ts.map