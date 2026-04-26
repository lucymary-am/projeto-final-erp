import { z } from "zod";
import { TipoMovimentacao, MotivoMovimentacao } from "../entities/Movimentacao.js";
export declare const createMovimentacaoSchema: z.ZodObject<{
    produtoId: z.ZodString;
    tipo: z.ZodEnum<typeof TipoMovimentacao>;
    quantidade: z.ZodNumber;
    motivo: z.ZodEnum<typeof MotivoMovimentacao>;
    observacao: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateMovimentacaoSchema: z.ZodObject<{
    tipo: z.ZodOptional<z.ZodEnum<typeof TipoMovimentacao>>;
    quantidade: z.ZodOptional<z.ZodNumber>;
    motivo: z.ZodOptional<z.ZodEnum<typeof MotivoMovimentacao>>;
    observacao: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateMovimentacaoDTO = z.infer<typeof createMovimentacaoSchema>;
export type UpdateMovimentacaoDTO = z.infer<typeof updateMovimentacaoSchema>;
//# sourceMappingURL=MovimentacaoDTO.d.ts.map