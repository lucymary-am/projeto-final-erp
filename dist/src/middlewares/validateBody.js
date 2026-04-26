export function validateBody(schema, options) {
    return (req, res, next) => {
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
//# sourceMappingURL=validateBody.js.map