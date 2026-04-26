var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, } from "typeorm";
import { Produto } from "./Produto.js";
let ItemPedido = class ItemPedido {
    id;
    pedido;
    produto;
    quantidade;
    preco_unitario;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ItemPedido.prototype, "id", void 0);
__decorate([
    ManyToOne("Pedido", (pedido) => pedido.itens),
    __metadata("design:type", Function)
], ItemPedido.prototype, "pedido", void 0);
__decorate([
    ManyToOne(() => Produto),
    __metadata("design:type", Produto)
], ItemPedido.prototype, "produto", void 0);
__decorate([
    Column({ type: "int", nullable: false }),
    __metadata("design:type", Number)
], ItemPedido.prototype, "quantidade", void 0);
__decorate([
    Column({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ItemPedido.prototype, "preco_unitario", void 0);
ItemPedido = __decorate([
    Entity("item_pedido")
], ItemPedido);
export { ItemPedido };
//# sourceMappingURL=ItemPedido.js.map