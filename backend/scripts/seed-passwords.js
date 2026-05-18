const { DEFAULT_EMPLOYEE_PASSWORD, createReadyClient, syncEmployeePasswords } = require('./runtime-helpers');

async function seedPasswords() {
  const client = await createReadyClient();

  try {
    const updated = await syncEmployeePasswords(client, {
      forceAll: true,
      password: DEFAULT_EMPLOYEE_PASSWORD,
    });

    console.log(`Contraseña actualizada para ${updated} empleado(s).`);
    console.log('');
    console.log('Credenciales de prueba:');
    console.log('  Email:      jose.perez@tacospepe.gt  (admin)');
    console.log(`  Contraseña: ${DEFAULT_EMPLOYEE_PASSWORD}`);
    console.log('');
    console.log(`Cualquier empleado usa la misma contraseña: ${DEFAULT_EMPLOYEE_PASSWORD}`);
  } finally {
    await client.end();
  }
}

seedPasswords().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
