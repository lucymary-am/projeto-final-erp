var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, } from "typeorm";
import { Cliente } from "./Cliente.js";
import { Usuario } from "./Usuario.js";
import { ItemPedido } from "./ItemPedido.js";
let Pedido = class Pedido {
    id;
    cliente;
    usuario;
    total;
    status;
    itens;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Pedido.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Cliente, (cliente) => cliente.pedidos),
    __metadata("design:type", Cliente)
], Pedido.prototype, "cliente", void 0);
__decorate([
    ManyToOne(() => Usuario, (usuario) => usuario.pedidos),
    __metadata("design:type", Usuario)
], Pedido.prototype, "usuario", void 0);
__decorate([
    Column({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Pedido.prototype, "total", void 0);
__decorate([
    Column({ type: "enum", enum: ["aberto", "pago", "cancelado"], default: "aberto" }),
    __metadata("design:type", String)
], Pedido.prototype, "status", void 0);
__decorate([
    OneToMany(() => ItemPedido, (item) => item.pedido, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Pedido.prototype, "itens", void 0);
__decorate([
    Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Pedido.prototype, "created_at", void 0);
Pedido = __decorate([
    Entity("pedido")
], Pedido);
export { Pedido };
//# sourceMappingURL=Pedido.js.map