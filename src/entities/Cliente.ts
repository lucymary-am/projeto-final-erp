import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Pedido } from "./Pedido";

@Entity("cliente")
export class Cliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column({ unique: true })
  cpf_cnpj!: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  telefone?: string;

  @OneToMany(() => Pedido, (pedido) => pedido.cliente)
  pedidos!: Pedido[];
}