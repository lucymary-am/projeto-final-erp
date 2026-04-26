import type { DataSource } from "typeorm";
import { Usuario } from "../entities/Usuario.js";
import type { CreateUsuarioDTO, UpdateUsuarioDTO } from "../dtos/UsuarioDTO.js";
export declare class UsuarioService {
    private userRepo;
    constructor(DataSource: DataSource);
    getById(id: string): Promise<Usuario | null>;
    findAll(): Promise<Usuario[]>;
    getByEmail(email: string): Promise<Usuario | null>;
    getByNome(nome: string): Promise<Usuario | null>;
    createUsuario(userData: CreateUsuarioDTO): Promise<Usuario>;
    updateUsuario(id: string, userUpdate: UpdateUsuarioDTO): Promise<Usuario>;
    deleteUsuario(id: string): Promise<void>;
}
//# sourceMappingURL=UsuarioService.d.ts.map