var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, } from "typeorm";
import { Produto } from "./Produto.js";
import { Usuario } from "./Usuario.js";
export var TipoMovimentacao;
(function (TipoMovimentacao) {
    TipoMovimentacao["ENTRADA"] = "entrada";
    TipoMovimentacao["SAIDA"] = "saida";
})(TipoMovimentacao || (TipoMovimentacao = {}));
export var MotivoMovimentacao;
(function (MotivoMovimentacao) {
    MotivoMovimentacao["VENDA"] = "venda";
    MotivoMovimentacao["COMPRA"] = "compra";
    MotivoMovimentacao["AJUSTE"] = "ajuste";
    MotivoMovimentacao["DEVOLUCAO"] = "devolucao";
})(MotivoMovimentacao || (MotivoMovimentacao = {}));
let MovimentacaoEstoque = class MovimentacaoEstoque {
    id;
    produto;
    // Tipo (entrada ou saída)
    tipo;
    quantidade;
    motivo; // venda, compra, ajuste
    // Usuário responsável
    usuario;
    // Observação opcional
    observacao;
    // Data automática
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], MovimentacaoEstoque.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Produto, { nullable: false }),
    JoinColumn({ name: "produto_id" }),
    __metadata("design:type", Produto)
], MovimentacaoEstoque.prototype, "produto", void 0);
__decorate([
    Column({ type: "enum", enum: TipoMovimentacao, nullable: false }),
    __metadata("design:type", String)
], MovimentacaoEstoque.prototype, "tipo", void 0);
__decorate([
    Column({ type: "int" }),
    __metadata("design:type", Number)
], MovimentacaoEstoque.prototype, "quantidade", void 0);
__decorate([
    Column({ type: "enum", enum: MotivoMovimentacao, nullable: false }),
    __metadata("design:type", String)
], MovimentacaoEstoque.prototype, "motivo", void 0);
__decorate([
    ManyToOne(() => Usuario, { nullable: false }),
    JoinColumn({ name: "usuario_id" }),
    __metadata("design:type", Usuario)
], MovimentacaoEstoque.prototype, "usuario", void 0);
__decorate([
    Column({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], MovimentacaoEstoque.prototype, "observacao", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], MovimentacaoEstoque.prototype, "created_at", void 0);
MovimentacaoEstoque = __decorate([
    Entity("movimentacao_estoque")
], MovimentacaoEstoque);
export { MovimentacaoEstoque };
//# sourceMappingURL=Movimentacao.js.map