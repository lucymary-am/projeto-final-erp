import { Produto } from "./Produto.js";
import { Usuario } from "./Usuario.js";
export declare enum TipoMovimentacao {
    ENTRADA = "entrada",
    SAIDA = "saida"
}
export declare enum MotivoMovimentacao {
    VENDA = "venda",
    COMPRA = "compra",
    AJUSTE = "ajuste",
    DEVOLUCAO = "devolucao"
}
export declare class MovimentacaoEstoque {
    id: string;
    produto: Produto;
    tipo: TipoMovimentacao;
    quantidade: number;
    motivo: MotivoMovimentacao;
    usuario: Usuario;
    observacao?: string;
    created_at: Date;
}
//# sourceMappingURL=Movimentacao.d.ts.map