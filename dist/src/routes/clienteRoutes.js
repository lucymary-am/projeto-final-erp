import { Router } from "express";
import { appDataSource } from "../database/appDataSource.js";
import ClienteController from "../controllers/ClienteController.js";
import { ClienteService } from "../services/ClienteService.js";
import { ensureAuth } from "../middlewares/ensureAuth.js";
const clienteRoutes = Router();
const clienteService = new ClienteService(appDataSource);
const clienteController = new ClienteController(clienteService);
clienteRoutes.get("/", ensureAuth, clienteController.findAllCliente.bind(clienteController));
clienteRoutes.get("/:id", ensureAuth, clienteController.findClienteById.bind(clienteController));
clienteRoutes.post("/", ensureAuth, clienteController.createCliente.bind(clienteController));
clienteRoutes.put("/:id", ensureAuth, clienteController.updateCliente.bind(clienteController));
clienteRoutes.delete("/:id", ensureAuth, clienteController.deleteCliente.bind(clienteController));
export default clienteRoutes;
//# sourceMappingURL=clienteRoutes.js.map