import { Request, Response } from "express";
export declare class ClienteController {
    private clienteService;
    create(req: Request, res: Response): Promise<Response>;
    findAll(req: Request, res: Response): Promise<Response>;
    findById(req: Request, res: Response): Promise<Response>;
    update(req: Request, res: Response): Promise<Response>;
    delete(req: Request, res: Response): Promise<Response>;
}
//# sourceMappingURL=ClienteController.d.ts.map