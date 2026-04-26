import { Router } from "express";
import { appDataSource } from "../database/appDataSource.js";
import FinanceiroController from "../controllers/FinanceiroController.js";
import { FinanceiroService } from "../services/FinanceiroService.js";
import { validateBody } from "../middlewares/validateBody.js";
import { ensureAuth } from "../middlewares/ensureAuth.js";
import { authorize } from "../middlewares/authorize.js";
import {
  createFinanceiroSchema,
  updateFinanceiroSchema,
  pagarFinanceiroSchema,
} from "../dtos/FinanceiroDTO.js";

const router = Router();

const service = new FinanceiroService(appDataSource);
const controller = new FinanceiroController(service);

router.post(
  "/",
  ensureAuth,
  authorize("financeiro", "create"),
  validateBody(createFinanceiroSchema),
  controller.createFinanceiro.bind(controller)
);

router.get(
  "/",
  ensureAuth,
  authorize("financeiro", "read"),
  controller.findAllFinanceiro.bind(controller)
);

router.get(
  "/:id",
  ensureAuth,
  authorize("financeiro", "read"),
  controller.findFinanceiroById.bind(controller)
);

router.put(
  "/:id",
  ensureAuth,
  authorize("financeiro", "update"),
  validateBody(updateFinanceiroSchema),
  controller.updateFinanceiro.bind(controller)
);

router.patch(
  "/:id/pagar",
  ensureAuth,
  authorize("financeiro", "update"),
  validateBody(pagarFinanceiroSchema),
  controller.pagarFinanceiro.bind(controller)
);

router.delete(
  "/:id",
  ensureAuth,
  authorize("financeiro", "delete"),
  controller.deleteFinanceiro.bind(controller)
);

export default router;