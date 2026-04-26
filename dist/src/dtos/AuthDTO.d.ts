import { z } from "zod";
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    senha: z.ZodString;
}, z.core.$strip>;
export declare const refreshSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, z.core.$strip>;
export declare const logoutSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, z.core.$strip>;
export declare const googleAuthSchema: z.ZodObject<{
    credential: z.ZodString;
}, z.core.$strip>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type RefreshDTO = z.infer<typeof refreshSchema>;
export type LogoutDTO = z.infer<typeof logoutSchema>;
export type GoogleAuthDTO = z.infer<typeof googleAuthSchema>;
//# sourceMappingURL=AuthDTO.d.ts.map