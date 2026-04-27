import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Cliente } from "./Cliente";
import { Usuario } from "./Usuario";
import { ItemPedido } from "./ItemPedido.js";

@Entity("pedido")
export class Pedido {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.pedidos)
  cliente!: Cliente;

  @ManyToOne(() => Usuario, (usuario) => usuario.pedidos)
  usuario!: Usuario;

  @Column("decimal", { precision: 10, scale: 2 })
  total!: number;

  @Column()
  status!: string; // aberto, pago, cancelado

  @OneToMany(() => ItemPedido, (item) => item.pedido, {
    cascade: true,
  })
  itens!: ItemPedido[];
}