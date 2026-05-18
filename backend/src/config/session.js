function parseBoolean(value, fallback) {
  if (typeof value !== 'string') {
    return fallback;
  }

  return value.toLowerCase() === 'true';
}

module.exports = {
  secret: process.env.SESSION_SECRET || 'G9qW3Lx8Ns2Vb7Km4Pd1Yt6Hr0Cf5Ju9Re3Xa8Mz2Uk7Wp4Dn1Tv6Bh0Qs5Lc8Ef',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 8,
    sameSite: process.env.SESSION_COOKIE_SAME_SITE || 'lax',
    secure: parseBoolean(process.env.SESSION_COOKIE_SECURE, false),
  },
};
