import { AppError } from "../errors/AppErrors.js";
export class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const meta = {};
            if (typeof req.ip === "string" && req.ip.length > 0) {
                meta.ip = req.ip;
            }
            const userAgent = req.headers["user-agent"];
            if (typeof userAgent === "string" && userAgent.length > 0) {
                meta.userAgent = userAgent;
            }
            const authData = await this.authService.login(email, senha, meta);
            return res.json({
                usuario: authData.usuario,
                accessToken: authData.accessToken,
                refreshToken: authData.refreshToken,
            });
        }
        catch (error) {
            console.error(error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno" });
        }
    }
    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            const authData = await this.authService.refresh(refreshToken);
            return res.json({
                usuario: authData.usuario,
                accessToken: authData.accessToken,
                refreshToken: authData.refreshToken,
            });
        }
        catch (error) {
            console.error(error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno" });
        }
    }
    async loginWithGoogle(req, res) {
        try {
            const { credential } = req.body;
            const meta = {};
            if (typeof req.ip === "string" && req.ip.length > 0) {
                meta.ip = req.ip;
            }
            const userAgent = req.headers["user-agent"];
            if (typeof userAgent === "string" && userAgent.length > 0) {
                meta.userAgent = userAgent;
            }
            const authData = await this.authService.loginWithGoogle(credential, meta);
            return res.json({
                usuario: authData.usuario,
                accessToken: authData.accessToken,
                refreshToken: authData.refreshToken,
            });
        }
        catch (error) {
            console.error(error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno" });
        }
    }
    async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            await this.authService.logout(refreshToken);
            return res.json({ message: "Logout realizado com sucesso" });
        }
        catch (error) {
            console.error(error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno" });
        }
    }
}
//# sourceMappingURL=AuthController.js.map