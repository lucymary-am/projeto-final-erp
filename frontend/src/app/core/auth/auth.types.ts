export interface UsuarioAuth {
  id_user: string;
  nome: string;
  email: string;
  perfil: string;
}

export interface AuthResponse {
  usuario: UsuarioAuth;
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}
