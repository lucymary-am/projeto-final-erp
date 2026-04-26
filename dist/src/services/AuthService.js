import { compare } from "bcryptjs";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import { Usuario } from "../entities/Usuario.js";
import { Sessao } from "../entities/Sessao.js";
import { AppError } from "../errors/AppErrors.js";
export class AuthService {
    userRepo;
    sessionRepo;
    constructor(dataSource) {
        this.userRepo = dataSource.getRepository(Usuario);
        this.sessionRepo = dataSource.getRepository(Sessao);
    }
    hashToken(token) {
        return createHash("sha256").update(token).digest("hex");
    }
    gerarAccessToken(usuario) {
        return jwt.sign({ sub: usuario.id_user, perfil: usuario.perfil }, process.env.JWT_ACCESS_SECRET, { expiresIn: "30m" });
    }
    gerarRefreshToken(sessionId, userId) {
        return jwt.sign({ sub: userId, sid: sessionId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    }
    toUsuarioPublico(usuario) {
        return {
            id_user: usuario.id_user,
            nome: usuario.nome,
            email: usuario.email,
            perfil: usuario.perfil,
        };
    }
    async login(email, senha, meta) {
        const usuario = await this.userRepo.findOne({
            where: { email },
            select: {
                id_user: true,
                nome: true,
                email: true,
                senha: true,
                perfil: true
            }
        });
        if (!usuario) {
            throw new AppError("Credenciais invalidas", 401);
        }
        const senhaCorreta = await compare(senha, usuario.senha);
        if (!senhaCorreta) {
            throw new AppError("Credenciais invalidas", 401);
        }
        const sessao = this.sessionRepo.create({
            usuario,
            refresh_token_hash: "",
            expires_at: new Date(),
            ip: meta?.ip ?? null,
            user_agent: meta?.userAgent ?? null,
        });
        await this.sessionRepo.save(sessao);
        const refreshToken = this.gerarRefreshToken(sessao.id, usuario.id_user);
        sessao.refresh_token_hash = this.hashToken(refreshToken);
        sessao.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.sessionRepo.save(sessao);
        const accessToken = this.gerarAccessToken(usuario);
        return { accessToken, refreshToken, usuario: this.toUsuarioPublico(usuario) };
    }
    async refresh(refreshToken) {
        let payload;
        try {
            payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        }
        catch {
            throw new AppError("Refresh token invalido", 401);
        }
        const sessionId = payload.sid;
        const userId = payload.sub;
        if (!sessionId || !userId) {
            throw new AppError("Refresh token invalido", 401);
        }
        const sessao = await this.sessionRepo.findOne({
            where: { id: sessionId },
            relations: { usuario: true },
        });
        if (!sessao || sessao.revoked_at)
            throw new AppError("Sessao invalida", 401);
        if (sessao.expires_at < new Date())
            throw new AppError("Refresh token expirado", 401);
        if (sessao.refresh_token_hash !== this.hashToken(refreshToken))
            throw new AppError("Refresh token invalido", 401);
        if (sessao.usuario.id_user !== userId)
            throw new AppError("Sessao invalida", 401);
        const novoRefreshToken = this.gerarRefreshToken(sessao.id, sessao.usuario.id_user);
        sessao.refresh_token_hash = this.hashToken(novoRefreshToken);
        sessao.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.sessionRepo.save(sessao);
        const accessToken = this.gerarAccessToken(sessao.usuario);
        return {
            accessToken,
            refreshToken: novoRefreshToken,
            usuario: this.toUsuarioPublico(sessao.usuario),
        };
    }
    async logout(refreshToken) {
        let payload;
        try {
            payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        }
        catch {
            throw new AppError("Refresh token invalido", 401);
        }
        const sessionId = payload.sid;
        if (!sessionId)
            throw new AppError("Refresh token invalido", 401);
        const sessao = await this.sessionRepo.findOne({ where: { id: sessionId } });
        if (!sessao)
            return;
        if (sessao.refresh_token_hash !== this.hashToken(refreshToken)) {
            throw new AppError("Refresh token invalido", 401);
        }
        sessao.revoked_at = new Date();
        await this.sessionRepo.save(sessao);
    }
}
//# sourceMappingURL=AuthService.js.map