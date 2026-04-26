export type PerfilUsuario = 'SOLICITANTE' | 'GESTOR' | 'COMPRADOR';

export interface RegisterPayload {
  nome: string;
  email: string;
  password: string;
  perfil: PerfilUsuario;
}
