import type { Request, Response } from "express";
import type { ProdutoService } from "../services/ProdutoService.js";
export default class ProdutoController {
    private produtoService;
    constructor(produtoService: ProdutoService);
    findAllProduto(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findProdutoById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createProduto(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProduto(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteProduto(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=ProdutoController.d.ts.map