import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
type ValidateParamsOptions = {
    statusCode?: number;
    message?: string;
};
export declare function validateParams(schema: ZodSchema<Record<string, string>>, options?: ValidateParamsOptions): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=validateParams.d.ts.map