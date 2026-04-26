import { permissions } from "../config/permissions.js";
import { AppError } from "../errors/AppErrors.js";
export function authorize(module, action) {
    return (req, _res, next) => {
        const user = req.auth;
        if (!user || !user.perfil) {
            throw new AppError("Usuário não autenticado", 401);
        }
        const perfil = user.perfil;
        const modulePermissions = permissions[module];
        if (!modulePermissions) {
            throw new AppError("Módulo não configurado", 500);
        }
        const allowedActions = modulePermissions[perfil];
        if (!allowedActions || !allowedActions.includes(action)) {
            throw new AppError("Acesso negado", 403);
        }
        next();
    };
}
//# sourceMappingURL=authorize.js.map