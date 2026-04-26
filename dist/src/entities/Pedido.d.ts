import { Cliente } from "./Cliente.js";
import { Usuario } from "./Usuario.js";
import { ItemPedido } from "./ItemPedido.js";
export declare class Pedido {
    id: string;
    cliente: Cliente;
    usuario: Usuario;
    total: number;
    status: string;
    itens: ItemPedido[];
    created_at: Date;
}
//# sourceMappingURL=Pedido.d.ts.map