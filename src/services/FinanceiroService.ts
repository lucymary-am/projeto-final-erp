import type { DataSource, Repository } from "typeorm";
import { Financeiro, TipoFinanceiro, StatusFinanceiro } from "../entities/Financeiro.js";
import { AppError } from "../errors/AppErrors.js";
import type { CreateFinanceiroDTO, UpdateFinanceiroDTO } from "../dtos/FinanceiroDTO.js";

export class FinanceiroService {
  private financeiroRepository: Repository<Financeiro>;

  constructor(dataSource: DataSource) {
    this.financeiroRepository = dataSource.getRepository(Financeiro);
  }

  async createFinanceiro(data: CreateFinanceiroDTO) {
    if (!data.tipo || !Object.values(TipoFinanceiro).includes(data.tipo)) {
      throw new AppError("Tipo inválido", 400);
    }

    if (data.status && !Object.values(StatusFinanceiro).includes(data.status)) {
      throw new AppError("Status inválido", 400);
    }

    if (!data.tipo || !data.descricao || !data.valor || !data.data_vencimento) {
      throw new AppError("Campos obrigatórios não informados", 400);
    }

    const financeiro = this.financeiroRepository.create({
      tipo: data.tipo,
      descricao: data.descricao,
      valor: Number(data.valor),
      status: data.status ?? StatusFinanceiro.PENDENTE,
      data_vencimento: data.data_vencimento,
      ...(data.data_pagamento && { data_pagamento: data.data_pagamento }),
    });

    return await this.financeiroRepository.save(financeiro);
  }

  async findAll() {
    return await this.financeiroRepository.find();
  }

  async findById(id: string) {
    if (!id) {
      throw new AppError("ID inválido", 400);
    }

    const financeiro = await this.financeiroRepository.findOne({
      where: { id },
    });

    if (!financeiro) {
      throw new AppError("Registro financeiro não encontrado.", 404);
    }

    return financeiro;
  }

  async updateFinanceiro(id: string, data: UpdateFinanceiroDTO) {
    const financeiro = await this.findById(id);

    if (data.tipo && !Object.values(TipoFinanceiro).includes(data.tipo)) {
      throw new AppError("Tipo inválido", 400);
    }

    if (data.status && !Object.values(StatusFinanceiro).includes(data.status)) {
      throw new AppError("Status inválido", 400);
    }

    this.financeiroRepository.merge(financeiro, data);

    return await this.financeiroRepository.save(financeiro);
  }

  async deleteFinanceiro(id: string) {
    const result = await this.financeiroRepository.delete(id);

    if (result.affected === 0) {
      throw new AppError("Registro não encontrado", 404);
    }
  }

  async pagarFinanceiro(id: string) {
    const financeiro = await this.findById(id);

    if (financeiro.status === StatusFinanceiro.PAGO) {
      throw new AppError("Já está pago", 400);
    }

    financeiro.status = StatusFinanceiro.PAGO;
    financeiro.data_pagamento = new Date();

    return await this.financeiroRepository.save(financeiro);
  }
}