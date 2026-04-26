export function validateParams(schema, options) {
    return (req, res, next) => {
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
//# sourceMappingURL=validateParams.js.map