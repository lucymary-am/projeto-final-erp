import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Cliente } from "./Cliente.js";
import { Usuario } from "./Usuario.js";
import { ItemPedido } from "./ItemPedido.js";
import { PedidoStatus } from "../enums/PedidoStatus.js";

@Entity("pedido")
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: "varchar", length: 4, unique: true, nullable: true })
  codigo!: string | null;

  @ManyToOne(() => Cliente, (cliente) => cliente.pedidos)
  cliente!: Cliente;

  @ManyToOne(() => Usuario, (usuario) => usuario.pedidos)
  usuario!: Usuario;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total!: number;

  /** Desconto em valor monetário (o total do pedido = soma dos itens − desconto, mínimo 0). */
  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  desconto!: number;

  @Column({ type: "enum", enum: PedidoStatus, default: PedidoStatus.Aberto })
  status!: PedidoStatus;

  @OneToMany(() => ItemPedido, (item) => item.pedido, {
    cascade: true,
  })
  itens!: ItemPedido[];

  @Column({ type: "date", nullable: true })
  data_entrega!: string | null;

  /** Preenchido quando o pedido passa a status `pago` (ou já criado como pago). */
  @Column({ type: "timestamp", nullable: true })
  data_pagamento!: Date | null;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;
}