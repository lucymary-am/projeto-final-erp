var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario.js";
let Sessao = class Sessao {
    id;
    usuario;
    refresh_token_hash;
    expires_at;
    revoked_at;
    ip;
    user_agent;
    // datetime evita erros de DEFAULT em TIMESTAMP(6) em algumas versões/configurações do MySQL.
    // CreateDateColumn preenche o valor no INSERT; não dependemos de DEFAULT no servidor.
    created_at;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Sessao.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Usuario, (usuario) => usuario.sessoes, { onDelete: "CASCADE" }),
    __metadata("design:type", Usuario)
], Sessao.prototype, "usuario", void 0);
__decorate([
    Column({ type: "text", nullable: false }),
    __metadata("design:type", String)
], Sessao.prototype, "refresh_token_hash", void 0);
__decorate([
    Column({ type: "timestamp", nullable: false }),
    __metadata("design:type", Date)
], Sessao.prototype, "expires_at", void 0);
__decorate([
    Column({ type: "timestamp", nullable: true }),
    __metadata("design:type", Object)
], Sessao.prototype, "revoked_at", void 0);
__decorate([
    Column({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], Sessao.prototype, "ip", void 0);
__decorate([
    Column({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], Sessao.prototype, "user_agent", void 0);
__decorate([
    CreateDateColumn({ type: "datetime" }),
    __metadata("design:type", Date)
], Sessao.prototype, "created_at", void 0);
Sessao = __decorate([
    Entity("sessao")
], Sessao);
export { Sessao };
//# sourceMappingURL=Sessao.js.map