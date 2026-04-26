import { DataSource } from "typeorm";
import { Pedido } from "../entities/Pedido.js";
export declare class PedidoService {
    private dataSource;
    private pedidoRepo;
    private clienteRepo;
    private usuarioRepo;
    constructor(dataSource: DataSource);
    private num;
    private totalFromItensPayload;
    private ajustarEstoqueProduto;
    private baixarEstoqueItensPedido;
    private restaurarEstoqueItensPedido;
    create(data: any): Promise<Pedido>;
    findAll(): Promise<Pedido[]>;
    findById(id: string): Promise<Pedido>;
    updateStatus(id: string, status: string): Promise<Pedido>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=PedidoService.d.ts.map