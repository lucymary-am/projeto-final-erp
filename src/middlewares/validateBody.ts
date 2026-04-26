import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type ValidateBodyOptions = {
  statusCode?: number;
  message?: string;
};

export function validateBody(schema: ZodSchema<any>, options?: ValidateBodyOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(options?.statusCode ?? 400).json({
        message: options?.message ?? "Dados inválidos",
        errors: result.error.issues,
      });
    }

    req.body = result.data;
    next();
  };
}