var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, } from "typeorm";
import { Produto } from "./Produto.js";
let Categoria = class Categoria {
    id;
    nome;
    descricao;
    produtos;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Categoria.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", nullable: false, unique: true }),
    __metadata("design:type", String)
], Categoria.prototype, "nome", void 0);
__decorate([
    Column({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], Categoria.prototype, "descricao", void 0);
__decorate([
    OneToMany(() => Produto, (produto) => produto.categoria),
    __metadata("design:type", Array)
], Categoria.prototype, "produtos", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Categoria.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Categoria.prototype, "updated_at", void 0);
Categoria = __decorate([
    Entity("categoria")
], Categoria);
export { Categoria };
//# sourceMappingURL=Categoria.js.map