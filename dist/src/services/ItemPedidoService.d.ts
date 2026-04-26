import { DataSource } from "typeorm";
import { ItemPedido } from "../entities/ItemPedido.js";
import type { CreateItemPedidoDTO, UpdateItemPedidoDTO } from "../dtos/ItemPedidoDTO.js";
export declare class ItemPedidoService {
    private dataSource;
    private itemRepo;
    private pedidoRepo;
    private produtoRepo;
    constructor(dataSource: DataSource);
    private num;
    private recalcularTotalPedido;
    private ajustarEstoqueProduto;
    private ensurePedidoEditavel;
    create(data: CreateItemPedidoDTO): Promise<ItemPedido>;
    findAll(pedidoId?: string): Promise<ItemPedido[]>;
    findById(id: number): Promise<ItemPedido>;
    update(id: number, data: UpdateItemPedidoDTO): Promise<ItemPedido>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=ItemPedidoService.d.ts.map