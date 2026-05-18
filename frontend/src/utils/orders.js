export const ORDER_TIMELINE = ['pendiente', 'aprobado', 'en_proceso', 'finalizado', 'entregado'];

const FALLBACK_TRANSITIONS = {
  pendiente: ['aprobado', 'cancelado'],
  aprobado: ['en_proceso', 'cancelado'],
  en_proceso: ['finalizado'],
  finalizado: ['entregado'],
  entregado: [],
  cancelado: [],
};

const ACTION_LABELS = {
  aprobado: 'Aprobar',
  cancelado: 'Cancelar',
  en_proceso: 'Enviar a cocina',
  finalizado: 'Marcar listo',
  entregado: 'Entregar',
};

export function formatMoney(value) {
  return `Q${Number(value || 0).toFixed(2)}`;
}

export function buildLineKey() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `line-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

export function normalizeLineConfig(config = {}) {
  const cantidad = Math.max(1, Number.parseInt(config.cantidad, 10) || 1);
  const extras = Array.isArray(config.extras)
    ? config.extras
        .map((extra) => ({
          id_extra: Number(extra.id_extra),
          cantidad: Math.max(1, Number.parseInt(extra.cantidad, 10) || 1),
        }))
        .filter((extra) => Number.isInteger(extra.id_extra) && extra.id_extra > 0)
        .sort((left, right) => left.id_extra - right.id_extra)
    : [];

  const removals = Array.isArray(config.removals)
    ? Array.from(
        new Set(
          config.removals
            .map((removal) => Number(removal.id_insumo))
            .filter((idInsumo) => Number.isInteger(idInsumo) && idInsumo > 0)
        )
      )
        .sort((left, right) => left - right)
        .map((id_insumo) => ({ id_insumo }))
    : [];

  return { cantidad, extras, removals };
}

export function sameLineSelection(left, right) {
  if (Number(left.id_producto) !== Number(right.id_producto)) {
    return false;
  }

  const normalizedLeft = normalizeLineConfig(left);
  const normalizedRight = normalizeLineConfig(right);

  if (normalizedLeft.extras.length !== normalizedRight.extras.length) {
    return false;
  }

  if (normalizedLeft.removals.length !== normalizedRight.removals.length) {
    return false;
  }

  const sameExtras = normalizedLeft.extras.every((extra, index) => (
    extra.id_extra === normalizedRight.extras[index].id_extra
    && extra.cantidad === normalizedRight.extras[index].cantidad
  ));

  if (!sameExtras) {
    return false;
  }

  return normalizedLeft.removals.every((removal, index) => (
    removal.id_insumo === normalizedRight.removals[index].id_insumo
  ));
}

export function toApiOrderItems(lines = []) {
  return lines.map((line) => {
    const normalized = normalizeLineConfig(line);
    return {
      id_producto: Number(line.id_producto),
      cantidad: normalized.cantidad,
      extras: normalized.extras,
      removals: normalized.removals,
    };
  });
}

export function getAllowedTransitions(order = {}) {
  if (Array.isArray(order.allowed_transitions)) {
    return order.allowed_transitions;
  }

  return FALLBACK_TRANSITIONS[order.estado_pedido || order.estado] || [];
}

export function getActionLabel(status) {
  return ACTION_LABELS[status] || status;
}

export function summarizeCartLine(line = {}) {
  const removals = Array.isArray(line.removals)
    ? line.removals.map((removal) => `Sin ${removal.nombre}`)
    : [];
  const extras = Array.isArray(line.extras)
    ? line.extras.map((extra) => (extra.cantidad > 1 ? `${extra.nombre} x${extra.cantidad}` : extra.nombre))
    : [];

  return [...removals, ...extras];
}

export function summarizeOrderModifications(modifications = []) {
  return modifications.map((modification) => modification.descripcion);
}
