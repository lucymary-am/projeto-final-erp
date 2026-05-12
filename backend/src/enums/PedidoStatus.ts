export enum PedidoStatus {
  Aberto = "aberto",
  Pago = "pago",
  Cancelado = "cancelado",
}

export function isPedidoStatus(value: unknown): value is PedidoStatus {
  const v = typeof value === "string" ? value.trim().toLowerCase() : value;
  return (
    v === PedidoStatus.Aberto ||
    v === PedidoStatus.Pago ||
    v === PedidoStatus.Cancelado
  );
}

export function parsePedidoStatusOrDefault(
  value: unknown,
  fallback: PedidoStatus = PedidoStatus.Aberto
): PedidoStatus {
  const s = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (s === PedidoStatus.Aberto) return PedidoStatus.Aberto;
  if (s === PedidoStatus.Pago) return PedidoStatus.Pago;
  if (s === PedidoStatus.Cancelado) return PedidoStatus.Cancelado;
  return fallback;
}
