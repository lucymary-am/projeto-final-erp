import { z } from "zod";
export declare const tipoFinanceiroEnum: z.ZodEnum<{
    receita: "receita";
    despesa: "despesa";
}>;
export declare const statusFinanceiroEnum: z.ZodEnum<{
    pago: "pago";
    cancelado: "cancelado";
    pendente: "pendente";
}>;
export declare const createFinanceiroSchema: z.ZodObject<{
    tipo: z.ZodEnum<{
        receita: "receita";
        despesa: "despesa";
    }>;
    descricao: z.ZodString;
    valor: z.ZodNumber;
    data_vencimento: z.ZodCoercedDate<unknown>;
    status: z.ZodOptional<z.ZodEnum<{
        pago: "pago";
        cancelado: "cancelado";
        pendente: "pendente";
    }>>;
    data_pagamento: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export declare const updateFinanceiroSchema: z.ZodObject<{
    tipo: z.ZodOptional<z.ZodEnum<{
        receita: "receita";
        despesa: "despesa";
    }>>;
    descricao: z.ZodOptional<z.ZodString>;
    valor: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<{
        pago: "pago";
        cancelado: "cancelado";
        pendente: "pendente";
    }>>;
    data_vencimento: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    data_pagamento: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export declare const pagarFinanceiroSchema: z.ZodObject<{
    data_pagamento: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type CreateFinanceiroDTO = z.infer<typeof createFinanceiroSchema>;
export type UpdateFinanceiroDTO = z.infer<typeof updateFinanceiroSchema>;
export type PagarFinanceiroDTO = z.infer<typeof pagarFinanceiroSchema>;
//# sourceMappingURL=FinanceiroDTO.d.ts.map