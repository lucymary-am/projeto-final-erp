import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Produto } from "./Produto";

@Entity("categoria")
export class Categoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nome!: string;

  @Column({ nullable: true })
  descricao?: string;

  @OneToMany(() => Produto, (produto) => produto.categoria)
  produtos!: Produto[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}