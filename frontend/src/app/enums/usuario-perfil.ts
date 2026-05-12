/**
 * Perfis de acesso. A ordem em `PERFIS` corresponde ao índice numérico enviado pela API.
 */
export enum UsuarioPerfil {
  ADMINISTRADOR_SISTEMA = 'ADMINISTRADOR_SISTEMA',
  GERENTE_SUPERVISOR = 'GERENTE_SUPERVISOR',
  OPERADOR_ESTOQUE = 'OPERADOR_ESTOQUE',
  FINANCEIRO_CONTADOR = 'FINANCEIRO_CONTADOR',
  APENAS_VISUALIZACAO = 'APENAS_VISUALIZACAO',
  VENDEDOR = 'VENDEDOR',
}

export type Perfil = UsuarioPerfil;

/** Ordem canônica = mapeamento numérico do backend (0 .. length - 1). */
export const PERFIS: readonly UsuarioPerfil[] = [
  UsuarioPerfil.ADMINISTRADOR_SISTEMA,
  UsuarioPerfil.GERENTE_SUPERVISOR,
  UsuarioPerfil.OPERADOR_ESTOQUE,
  UsuarioPerfil.FINANCEIRO_CONTADOR,
  UsuarioPerfil.APENAS_VISUALIZACAO,
  UsuarioPerfil.VENDEDOR,
];

export const PERFIL_PADRAO: UsuarioPerfil = UsuarioPerfil.APENAS_VISUALIZACAO;

export const PERFIL_LABELS: Record<UsuarioPerfil, string> = {
  [UsuarioPerfil.ADMINISTRADOR_SISTEMA]: 'Administrador do Sistema',
  [UsuarioPerfil.GERENTE_SUPERVISOR]: 'Gerente / Supervisor',
  [UsuarioPerfil.OPERADOR_ESTOQUE]: 'Operador de Estoque',
  [UsuarioPerfil.FINANCEIRO_CONTADOR]: 'Financeiro / Contador',
  [UsuarioPerfil.APENAS_VISUALIZACAO]: 'Apenas Visualizacao',
  [UsuarioPerfil.VENDEDOR]: 'Vendedor',
};

export function isPerfilKey(value: string): value is Perfil {
  return (PERFIS as readonly string[]).includes(value);
}

/**
 * Converte valor vindo da API (índice numérico do enum TypeScript ou string do perfil)
 * para o enum `UsuarioPerfil`.
 */
export function perfilFromApi(val: unknown): Perfil | undefined {
  if (val === null || val === undefined || val === '') return undefined;
  if (typeof val === 'number' && Number.isInteger(val) && val >= 0 && val < PERFIS.length) {
    return PERFIS[val];
  }
  const s = String(val).trim();
  return isPerfilKey(s) ? s : undefined;
}

export function perfilToKeyOrDefault(val: unknown, padrao: Perfil = PERFIL_PADRAO): Perfil {
  return perfilFromApi(val) ?? padrao;
}

/**
 * Valida se há perfil (aceita índice numérico 0 — ADMINISTRADOR_SISTEMA).
 * Não usar expressões do tipo `!perfil` / `!!perfil`.
 */
export function perfilEstaDefinido(val: unknown): boolean {
  if (val === undefined || val === null || val === '') return false;
  if (typeof val === 'number') {
    return Number.isInteger(val) && val >= 0 && val < PERFIS.length;
  }
  return isPerfilKey(String(val).trim());
}

/** Chave estável para filtros e comparações (string vazia se não reconhecido). */
export function perfilChaveOuVazio(val: unknown): string {
  return perfilFromApi(val) ?? '';
}
