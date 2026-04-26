import { Usuario } from "./Usuario.js";
export declare class Sessao {
    id: string;
    usuario: Usuario;
    refresh_token_hash: string;
    expires_at: Date;
    revoked_at?: Date | null;
    ip?: string | null;
    user_agent?: string | null;
    created_at: Date;
}
//# sourceMappingURL=Sessao.d.ts.map