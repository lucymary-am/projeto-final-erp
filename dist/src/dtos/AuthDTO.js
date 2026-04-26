import { z } from "zod";
export const loginSchema = z.object({
    email: z.string().email(),
    senha: z.string().min(6)
});
export const refreshSchema = z.object({
    refreshToken: z.string().min(10)
});
export const logoutSchema = refreshSchema;
export const googleAuthSchema = z.object({
    credential: z.string().min(10)
});
//# sourceMappingURL=AuthDTO.js.map