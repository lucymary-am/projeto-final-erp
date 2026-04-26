import { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=AuthController.d.ts.map