const authService = require('../services/authService');

async function me(req, res) {
  const user = authService.getCurrentUser(req.session.user);
  res.json({ user });
}

async function login(req, res) {
  const user = await authService.login(req.body);
  req.session.user = user;
  res.json({ user });
}

async function logout(req, res) {
  await new Promise((resolve) => req.session.destroy(resolve));
  res.json({ message: 'Sesión cerrada.' });
}

module.exports = {
  me,
  login,
  logout,
};
