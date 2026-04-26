import type { DataSource } from "typeorm";
import { Usuario } from "../entities/Usuario.js";
/** Dados do usuário seguros para resposta de API (sem senha). */
export type UsuarioAuthPublico = Pick<Usuario, "id_user" | "nome" | "email" | "perfil">;
export declare class AuthService {
    private userRepo;
    private sessionRepo;
    constructor(dataSource: DataSource);
    private hashToken;
    private gerarAccessToken;
    private gerarRefreshToken;
    private toUsuarioPublico;
    login(email: string, senha: string, meta?: {
        ip?: string;
        userAgent?: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        usuario: UsuarioAuthPublico;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        usuario: UsuarioAuthPublico;
    }>;
    logout(refreshToken: string): Promise<void>;
}
//# sourceMappingURL=AuthService.d.ts.map