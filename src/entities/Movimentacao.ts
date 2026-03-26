import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Produto } from "./Produto";
import { Usuario } from "./Usuario";

@Entity("movimentacao_estoque")
export class MovimentacaoEstoque {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Produto)
  produto!: Produto;

  @Column()
  tipo!: string; // entrada | saida

  @Column()
  quantidade!: number;

  @Column()
  motivo!: string; // venda, compra, ajuste

  @ManyToOne(() => Usuario)
  usuario!: Usuario;

  @CreateDateColumn()
  created_at!: Date;
}