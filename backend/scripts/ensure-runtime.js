const { DEFAULT_EMPLOYEE_PASSWORD, createReadyClient, syncEmployeePasswords } = require('./runtime-helpers');

async function main() {
  const client = await createReadyClient();

  try {
    const updated = await syncEmployeePasswords(client);

    if (updated > 0) {
      console.log(`Se actualizaron ${updated} hash(es) placeholder de empleados.`);
    } else {
      console.log('Los hashes de empleados ya estaban listos.');
    }

    console.log(`Credenciales del personal listas. Contraseña por defecto: ${DEFAULT_EMPLOYEE_PASSWORD}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Error preparando el runtime:', error.message);
  process.exit(1);
});
