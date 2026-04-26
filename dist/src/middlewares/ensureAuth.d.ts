import type { RequestHandler } from "express";
import { type JwtPayload } from "jsonwebtoken";
import { Perfil } from "../types/Perfil.js";
declare global {
    namespace Express {
        interface Request {
            auth?: AuthPayload;
        }
    }
}
export interface AuthPayload extends JwtPayload {
    sub: string;
    perfil: Perfil;
}
export declare const ensureAuth: RequestHandler;
//# sourceMappingURL=ensureAuth.d.ts.map