export function getRoleHomePath(role) {
  if (role === 'cocinero') return '/pedidos';
  if (role === 'cajero') return '/pos';
  return '/dashboard';
}
