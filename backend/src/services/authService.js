const bcrypt = require('bcryptjs');
const authModel = require('../models/authModel');
const { AppError } = require('../utils/appError');

function sanitizeSessionUser(employee) {
  return {
    id: employee.id_empleado,
    nombre: employee.nombre,
    apellido: employee.apellido,
    email: employee.email,
    rol: employee.rol,
  };
}

async function login(credentials) {
  const email = String(credentials.email || '').trim().toLowerCase();
  const password = String(credentials.password || '');

  if (!email || !password) {
    throw new AppError(400, 'Correo y contraseña son obligatorios.');
  }

  const employee = await authModel.findActiveEmployeeByEmail(email);
  if (!employee) {
    throw new AppError(401, 'Correo o contraseña incorrectos.');
  }

  const isValidPassword = await bcrypt.compare(password, employee.password_hash);
  if (!isValidPassword) {
    throw new AppError(401, 'Correo o contraseña incorrectos.');
  }

  return sanitizeSessionUser(employee);
}

function getCurrentUser(sessionUser) {
  if (!sessionUser) {
    throw new AppError(401, 'No autenticado');
  }

  return sessionUser;
}

module.exports = {
  login,
  getCurrentUser,
};
