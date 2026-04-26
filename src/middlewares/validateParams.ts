import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

type ValidateParamsOptions = {
  statusCode?: number;
  message?: string;
};

export function validateParams(
  schema: ZodSchema<Record<string, string>>,
  options?: ValidateParamsOptions
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(options?.statusCode ?? 400).json({
        message: options?.message ?? "Parâmetros inválidos",
        errors: result.error.issues,
      });
    }

    Object.assign(req.params, result.data);
    next();
  };
}
