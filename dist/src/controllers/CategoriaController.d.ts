import type { Request, Response } from "express";
import type { CategoriaService } from "../services/CategoriaService.js";
export default class CategoriaController {
    private categoriaService;
    constructor(categoriaService: CategoriaService);
    findAllCategoria(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findCategoriaById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createCategoria(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateCategoria(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteCategoria(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=CategoriaController.d.ts.map