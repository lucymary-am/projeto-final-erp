import { z } from "zod";
export declare const createItemPedidoSchema: z.ZodObject<{
    pedidoId: z.ZodString;
    produtoId: z.ZodString;
    quantidade: z.ZodCoercedNumber<unknown>;
    preco_unitario: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const updateItemPedidoSchema: z.ZodObject<{
    pedidoId: z.ZodOptional<z.ZodString>;
    produtoId: z.ZodOptional<z.ZodString>;
    quantidade: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    preco_unitario: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const itemPedidoIdParamSchema: z.ZodCoercedNumber<unknown>;
export declare const listItemPedidoQuerySchema: z.ZodObject<{
    pedidoId: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type CreateItemPedidoDTO = z.infer<typeof createItemPedidoSchema>;
export type UpdateItemPedidoDTO = z.infer<typeof updateItemPedidoSchema>;
//# sourceMappingURL=ItemPedidoDTO.d.ts.map