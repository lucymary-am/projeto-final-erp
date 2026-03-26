import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity("financeiro")
export class Financeiro {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tipo!: string; // pagar | receber

  @Column()
  descricao!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  valor!: number;

  @Column()
  status!: string; // pendente | pago

  @Column()
  data_vencimento!: Date;

  @Column({ nullable: true })
  data_pagamento?: Date;
}