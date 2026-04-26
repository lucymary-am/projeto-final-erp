var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Perfil } from '../types/Perfil.js';
import { Sessao } from "./Sessao.js";
let Usuario = class Usuario {
    id_user;
    nome;
    email;
    senha;
    perfil;
    ativo;
    pedidos;
    sessoes;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Usuario.prototype, "id_user", void 0);
__decorate([
    Column({ type: 'varchar', nullable: false, unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "nome", void 0);
__decorate([
    Column({ type: 'varchar', nullable: false, unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    Column({ type: 'varchar', select: false, nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "senha", void 0);
__decorate([
    Column({ type: 'enum', enum: Perfil, select: false, nullable: false }),
    __metadata("design:type", Number)
], Usuario.prototype, "perfil", void 0);
__decorate([
    Column({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Usuario.prototype, "ativo", void 0);
__decorate([
    OneToMany("Pedido", (pedido) => pedido.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "pedidos", void 0);
__decorate([
    OneToMany(() => Sessao, (s) => s.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "sessoes", void 0);
__decorate([
    Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Usuario.prototype, "created_at", void 0);
Usuario = __decorate([
    Entity('usuario')
], Usuario);
export { Usuario };
//# sourceMappingURL=Usuario.js.map