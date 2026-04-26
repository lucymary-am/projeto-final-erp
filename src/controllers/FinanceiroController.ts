import type { Request, Response } from "express";
import type { FinanceiroService } from "../services/FinanceiroService.js";
import type { CreateFinanceiroDTO, UpdateFinanceiroDTO } from "../dtos/FinanceiroDTO.js";
import { AppError } from "../errors/AppErrors.js";

export default class FinanceiroController {
  constructor(private service: FinanceiroService) {}

  async createFinanceiro(req: Request, res: Response) {
    const financeiro = await this.service.createFinanceiro(req.body as CreateFinanceiroDTO);
    return res.status(201).json(financeiro);
  }

  async findAllFinanceiro(_req: Request, res: Response) {
    const lista = await this.service.findAll();
    return res.json(lista);
  }

  async findFinanceiroById(req: Request, res: Response) {
    const id = this.getIdParam(req);
    const financeiro = await this.service.findById(id);
    return res.json(financeiro);
  }

  async updateFinanceiro(req: Request, res: Response) {
    const id = this.getIdParam(req);
    const financeiro = await this.service.updateFinanceiro(id, req.body as UpdateFinanceiroDTO);
    return res.json(financeiro);
  }

  async pagarFinanceiro(req: Request, res: Response) {
    const id = this.getIdParam(req);
    const financeiro = await this.service.pagarFinanceiro(id);
    return res.json(financeiro);
  }

  async deleteFinanceiro(req: Request, res: Response) {
    const id = this.getIdParam(req);
    await this.service.deleteFinanceiro(id);
    return res.status(204).send();
  }

  private getIdParam(req: Request): string {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      throw new AppError("ID inválido", 400);
    }

    return id;
  }
}