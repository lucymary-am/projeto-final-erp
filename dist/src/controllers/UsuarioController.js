import { AppError } from "../errors/AppErrors.js";
export default class UsuarioController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async findAllUser(req, res) {
        const users = await this.userService.findAll();
        return res.status(200).json(users);
    }
    async findUserById(req, res) {
        const id = req.params.id;
        const user = await this.userService.getById(id);
        if (!user) {
            throw new AppError("Usuario nao encontrado!", 404);
        }
        return res.status(200).json(user);
    }
    async createUser(req, res) {
        const data = req.body;
        const user = await this.userService.createUsuario(data);
        return res.status(201).json(user);
    }
    async updateUser(req, res) {
        const id = req.params.id;
        const data = req.body;
        const user = await this.userService.updateUsuario(id, data);
        return res.status(200).json(user);
    }
    async deleteUser(req, res) {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            throw new AppError("ID inválido", 400);
        }
        await this.userService.deleteUsuario(id);
        return res.status(200).json({ message: "Removido" });
    }
}
//# sourceMappingURL=UsuarioController.js.map