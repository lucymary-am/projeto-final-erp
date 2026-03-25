import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Perfil } from '../types/Perfil.js';

@Entity('usuario')
export class Usuario {

  @PrimaryGeneratedColumn('uuid')
  id_user!: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  nome!: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email!: string;

  @Column({ type: 'varchar', select:false, nullable: false })
  senha!: string;

  @Column({ type: 'enum', enum: Perfil, select:false, nullable: false })
  perfil!: Perfil;
}