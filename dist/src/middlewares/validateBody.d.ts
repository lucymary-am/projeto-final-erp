import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
type ValidateBodyOptions = {
    statusCode?: number;
    message?: string;
};
export declare function validateBody(schema: ZodSchema<any>, options?: ValidateBodyOptions): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=validateBody.d.ts.map