/**
 * Reexporta perfil de usuário a partir de `enums/usuario-perfil` para imports estáveis em serviços.
 */
export {
  UsuarioPerfil,
  type Perfil,
  PERFIS,
  PERFIL_PADRAO,
  PERFIL_LABELS,
  isPerfilKey,
  perfilFromApi,
  perfilToKeyOrDefault,
  perfilEstaDefinido,
  perfilChaveOuVazio,
} from '../enums/usuario-perfil';
