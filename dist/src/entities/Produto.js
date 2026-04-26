var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, } from "typeorm";
import { Categoria } from "./Categoria.js";
let Produto = class Produto {
    id_prod;
    nome;
    descricao;
    codigo;
    // Em TypeORM, `decimal` pode vir como string em runtime dependendo da configuração;
    // aqui deixamos como number para facilitar uso no código.
    preco;
    estoque_atual;
    estoque_minimo;
    estoque_maximo;
    categoria;
    ativo;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Produto.prototype, "id_prod", void 0);
__decorate([
    Column({ type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], Produto.prototype, "nome", void 0);
__decorate([
    Column({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Produto.prototype, "descricao", void 0);
__decorate([
    Column({ type: 'varchar', nullable: false, unique: true }),
    __metadata("design:type", String)
], Produto.prototype, "codigo", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Produto.prototype, "preco", void 0);
__decorate([
    Column({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Produto.prototype, "estoque_atual", void 0);
__decorate([
    Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Produto.prototype, "estoque_minimo", void 0);
__decorate([
    Column({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Produto.prototype, "estoque_maximo", void 0);
__decorate([
    ManyToOne(() => Categoria, (categoria) => categoria.produtos),
    __metadata("design:type", Categoria)
], Produto.prototype, "categoria", void 0);
__decorate([
    Column({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Produto.prototype, "ativo", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Produto.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Produto.prototype, "updated_at", void 0);
Produto = __decorate([
    Entity('produto')
], Produto);
export { Produto };
//# sourceMappingURL=Produto.js.map