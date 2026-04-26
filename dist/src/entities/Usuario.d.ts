import { Perfil } from '../types/Perfil.js';
import type { Pedido } from './Pedido.js';
import { Sessao } from "./Sessao.js";
export declare class Usuario {
    id_user: string;
    nome: string;
    email: string;
    senha: string;
    perfil: Perfil;
    ativo: boolean;
    pedidos: Pedido[];
    sessoes: Sessao[];
    created_at: Date;
}
//# sourceMappingURL=Usuario.d.ts.map