module.exports = {
  findActiveEmployeeByEmail: `
    SELECT id_empleado, nombre, apellido, email, password_hash, rol
    FROM empleado
    WHERE email = $1
      AND activo = TRUE
  `,
};
