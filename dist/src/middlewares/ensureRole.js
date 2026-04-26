import { AppError } from "../errors/AppErrors.js";
export const ensureRole = (...perfisPermitido) => {
    return (req, res, next) => {
        if (!req.auth || !req.auth.perfil) {
            throw next(new AppError("Usuário sem perfil no token", 403));
        }
        if (!perfisPermitido.includes(req.auth.perfil)) {
            throw next(new AppError("Acesso negado", 403));
        }
        next();
    };
};
//# sourceMappingURL=ensureRole.js.map