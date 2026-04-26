import { z } from "zod";
import { Perfil } from "../types/Perfil.js";
export declare const perfilSchema: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodEnum<typeof Perfil>>;
export declare const createUsuarioSchema: z.ZodObject<{
    nome: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    perfil: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodEnum<typeof Perfil>>;
}, z.core.$strip>;
export declare const updateUsuarioSchema: z.ZodObject<{
    nome: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodEmail>;
    perfil: z.ZodOptional<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodEnum<typeof Perfil>>>;
}, z.core.$strip>;
export declare const usuarioIdParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type CreateUsuarioDTO = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioDTO = z.infer<typeof updateUsuarioSchema>;
//# sourceMappingURL=UsuarioDTO.d.ts.map