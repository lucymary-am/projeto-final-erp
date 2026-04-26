import type { Request, Response } from "express";
import type { ClienteService, CreateClienteDTO, UpdateClienteDTO } from "../services/ClienteService.js";
import { AppError } from "../errors/AppErrors.js";

export default class ClienteController {
  private clienteService: ClienteService;

  constructor(clienteService: ClienteService) {
    this.clienteService = clienteService;
  }

  async createCliente(req: Request, res: Response) {
    const cliente = await this.clienteService.createCliente(req.body as CreateClienteDTO);
    return res.status(201).json(cliente);
  }

  async findAllCliente(_req: Request, res: Response) {
    const clientes = await this.clienteService.findAll();
    return res.status(200).json(clientes);
  }

  async findClienteById(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError("ID invalido", 400);
    }

    const cliente = await this.clienteService.getById(id);
    if (!cliente) {
      throw new AppError("Cliente nao encontrado!", 404);
    }

    return res.status(200).json(cliente);
  }

  async updateCliente(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError("ID invalido", 400);
    }

    const clienteAtualizado = await this.clienteService.updateCliente(id, req.body as UpdateClienteDTO);
    return res.status(200).json(clienteAtualizado);
  }

  async deleteCliente(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError("ID invalido", 400);
    }

    await this.clienteService.deleteCliente(id);
    return res.status(204).send();
  }
}