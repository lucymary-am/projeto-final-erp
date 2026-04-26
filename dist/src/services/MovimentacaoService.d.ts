import { MovimentacaoEstoque, TipoMovimentacao, MotivoMovimentacao } from "../entities/Movimentacao.js";
export declare class MovimentacaoEstoqueService {
    create(data: {
        produtoId: string;
        usuarioId: string;
        tipo: TipoMovimentacao;
        quantidade: number;
        motivo: MotivoMovimentacao;
        observacao?: string;
    }): Promise<MovimentacaoEstoque>;
    findAll(): Promise<MovimentacaoEstoque[]>;
    findById(id: string): Promise<MovimentacaoEstoque>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=MovimentacaoService.d.ts.map