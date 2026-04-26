import { Router } from "express";
import { appDataSource } from "../database/appDataSource.js";
import { UsuarioService } from "../services/UsuarioService.js";
import UsuarioController from "../controllers/UsuarioController.js";
import { validateBody } from "../middlewares/validateBody.js";
import { validateParams } from "../middlewares/validateParams.js";
import { createUsuarioSchema, updateUsuarioSchema, usuarioIdParamsSchema, } from "../dtos/UsuarioDTO.js";
import { ensureAuth } from "../middlewares/ensureAuth.js";
import { ensureRole } from "../middlewares/ensureRole.js";
import { Perfil } from "../types/Perfil.js";
const router = Router();
const usuarioService = new UsuarioService(appDataSource);
const usuarioController = new UsuarioController(usuarioService);
router.get("/", ensureAuth, ensureRole(Perfil.GESTOR), usuarioController.findAllUser.bind(usuarioController));
/** Mesmos handlers de `/:id`, para clientes que usam `/usuarios/id/<uuid>`. */
const findUserByIdStack = [
    ensureAuth,
    ensureRole(Perfil.GESTOR, Perfil.SOLICITANTE, Perfil.COMPRADOR),
    validateParams(usuarioIdParamsSchema, { statusCode: 422, message: "Parametros de usuario invalidos" }),
    usuarioController.findUserById.bind(usuarioController),
];
router.get("/id/:id", ...findUserByIdStack);
router.get("/:id", ...findUserByIdStack);
// Cadastro publico para fluxo de criacao de conta no frontend.
router.post("/", validateBody(createUsuarioSchema, { statusCode: 422, message: "Dados de usuario invalidos" }), usuarioController.createUser.bind(usuarioController));
const updateUserStack = [
    ensureAuth,
    validateParams(usuarioIdParamsSchema, { statusCode: 422, message: "Parametros de usuario invalidos" }),
    validateBody(updateUsuarioSchema, { statusCode: 422, message: "Dados de usuario invalidos" }),
    usuarioController.updateUser.bind(usuarioController),
];
router.put("/id/:id", ...updateUserStack);
router.put("/:id", ...updateUserStack);
const deleteUserStack = [
    ensureAuth,
    ensureRole(Perfil.GESTOR),
    validateParams(usuarioIdParamsSchema, { statusCode: 422, message: "Parametros de usuario invalidos" }),
    usuarioController.deleteUser.bind(usuarioController),
];
router.delete("/id/:id", ...deleteUserStack);
router.delete("/:id", ...deleteUserStack);
export { router as usuarioRoutes };
//# sourceMappingURL=usuarioRoutes.js.map