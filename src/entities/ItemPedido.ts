import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { Pedido } from "./Pedido";
import { Produto } from "./Produto";

@Entity("item_pedido")
export class ItemPedido {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.itens)
  pedido!: Pedido;

  @ManyToOne(() => Produto)
  produto!: Produto;

  @Column()
  quantidade!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  preco_unitario!: number;
}