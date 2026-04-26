import type { Request, Response } from "express";
import type { ClienteService } from "../services/ClienteService.js";
export default class ClienteController {
    private clienteService;
    constructor(clienteService: ClienteService);
    createCliente(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findAllCliente(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findClienteById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateCliente(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteCliente(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=ClienteController.d.ts.map