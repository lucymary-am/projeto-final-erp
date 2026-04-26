export declare enum TipoFinanceiro {
    RECEITA = "receita",
    DESPESA = "despesa"
}
export declare enum StatusFinanceiro {
    PENDENTE = "pendente",
    PAGO = "pago",
    CANCELADO = "cancelado"
}
export declare class Financeiro {
    id: string;
    tipo: TipoFinanceiro;
    descricao: string;
    valor: number;
    status: StatusFinanceiro;
    data_vencimento: Date;
    data_pagamento?: Date;
    created_at: Date;
    updated_at: Date;
}
//# sourceMappingURL=Financeiro.d.ts.map