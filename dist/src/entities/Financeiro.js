var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, } from "typeorm";
export var TipoFinanceiro;
(function (TipoFinanceiro) {
    TipoFinanceiro["RECEITA"] = "receita";
    TipoFinanceiro["DESPESA"] = "despesa";
})(TipoFinanceiro || (TipoFinanceiro = {}));
export var StatusFinanceiro;
(function (StatusFinanceiro) {
    StatusFinanceiro["PENDENTE"] = "pendente";
    StatusFinanceiro["PAGO"] = "pago";
    StatusFinanceiro["CANCELADO"] = "cancelado";
})(StatusFinanceiro || (StatusFinanceiro = {}));
let Financeiro = class Financeiro {
    id;
    tipo;
    descricao;
    valor;
    status;
    data_vencimento;
    data_pagamento;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Financeiro.prototype, "id", void 0);
__decorate([
    Column({ type: "enum", enum: TipoFinanceiro, }),
    __metadata("design:type", String)
], Financeiro.prototype, "tipo", void 0);
__decorate([
    Column({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Financeiro.prototype, "descricao", void 0);
__decorate([
    Column("decimal", { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Financeiro.prototype, "valor", void 0);
__decorate([
    Column({
        type: "enum",
        enum: StatusFinanceiro,
        default: StatusFinanceiro.PENDENTE,
    }),
    __metadata("design:type", String)
], Financeiro.prototype, "status", void 0);
__decorate([
    Column({ type: "date" }),
    __metadata("design:type", Date)
], Financeiro.prototype, "data_vencimento", void 0);
__decorate([
    Column({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Financeiro.prototype, "data_pagamento", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Financeiro.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Financeiro.prototype, "updated_at", void 0);
Financeiro = __decorate([
    Entity("financeiro")
], Financeiro);
export { Financeiro };
//# sourceMappingURL=Financeiro.js.map