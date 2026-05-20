/**
 * seed-product-images.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Sube imágenes reales (desde URLs públicas) a Cloudinary para cada producto,
 * actualiza la BD de Neon y escribe db/init/sql/seed_product_images.sql con
 * los UPDATE statements para que el seeding de Docker también incluya imágenes.
 *
 * Uso:
 *   node backend/scripts/seed-product-images.js
 *
 * Requiere: CLOUDINARY_* y DATABASE_URL configurados en backend/.env
 */

'use strict';

// Carga variables de entorno antes de cualquier otra cosa
const { loadBackendEnv } = require('../src/config/loadEnv');
loadBackendEnv();

const fs   = require('fs');
const path = require('path');
const { Client } = require('pg');
const { getCloudinaryConfig } = require('../src/config/cloudinary');
const { buildDbConfig }       = require('../src/config/dbConfig');

// ─── Mapeo nombre de producto → URL de imagen pública ────────────────────────
// Fuente: Unsplash (licencia libre). Cloudinary descarga la imagen desde la
// URL directamente, por lo que no necesitamos convertirla a base64 localmente.
const PRODUCT_IMAGES = {
  // ── Tacos ──────────────────────────────────────────────────────────────────
  'Taco al Pastor':
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
  'Taco de Bistec':
    'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&q=80',
  'Taco de Chorizo':
    'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800&q=80',
  'Taco de Lengua':
    'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80',
  'Taco de Pollo':
    'https://images.unsplash.com/photo-1611250188496-e966043a0629?w=800&q=80',
  'Taco Vegetariano':
    'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=800&q=80',
  'Taco Campechano':
    'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800&q=80',
  'Taco Gringa':
    'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
  'Taco Dorado de Pollo':
    'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800&q=80',
  'Taco de Suadero':
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80',
  'Taco Especial del Pepe':
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
  'Taco de Cochinita Pibil':
    'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&q=80',

  // ── Bebidas ────────────────────────────────────────────────────────────────
  'Horchata Grande':
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80',
  'Agua de Jamaica':
    'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=800&q=80',
  'Coca-Cola':
    'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=800&q=80',
  'Agua Pura':
    'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80',
  'Limonada con Chía':
    'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&q=80',
  'Café de Olla':
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',

  // ── Combos ─────────────────────────────────────────────────────────────────
  'Combo Clásico':
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
  'Combo Familiar':
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
  'Combo del Pepe':
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
  'Combo Vegetariano':
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  'Combo Pareja':
    'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80',
  'Combo Ejecutivo':
    'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80',
  'Combo Picante':
    'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=800&q=80',
  'Combo Postre':
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
  'Combo Desayuno':
    'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80',

  // ── Postres ────────────────────────────────────────────────────────────────
  'Flan Napolitano':
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80',
  'Churros con Chocolate':
    'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=800&q=80',
  'Arroz con Leche':
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80',
};

// ─── Cloudinary ───────────────────────────────────────────────────────────────
function buildBasicAuthHeader(cfg) {
  return `Basic ${Buffer.from(`${cfg.apiKey}:${cfg.apiSecret}`).toString('base64')}`;
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

async function uploadFromUrl(imageUrl, productName) {
  const cfg = getCloudinaryConfig();
  const endpoint = `https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`;

  const formData = new FormData();
  formData.append('file', imageUrl);               // Cloudinary acepta HTTP URLs directas
  formData.append('folder', cfg.folder);
  formData.append('public_id', `${slugify(productName)}-seed`);
  formData.append('overwrite', 'true');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: buildBasicAuthHeader(cfg) },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || `HTTP ${response.status}`);
  }

  return {
    imagen_url:       data.secure_url || data.url,
    imagen_public_id: data.public_id,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const dbConfig = buildDbConfig();
  const client   = new Client(dbConfig);
  await client.connect();

  const sqlLines = [
    '-- Imágenes de productos (generado por seed-product-images.js)',
    '-- Ejecutar después de datos_prueba.sql en inicializaciones limpias de Docker.',
    '',
  ];

  const ok      = [];
  const failed  = [];
  const nombres = Object.keys(PRODUCT_IMAGES);

  console.log(`\n🌮 Inyectando imágenes para ${nombres.length} productos...\n`);

  for (const nombre of nombres) {
    const imageUrl = PRODUCT_IMAGES[nombre];
    process.stdout.write(`  • ${nombre.padEnd(34)} `);

    try {
      const { imagen_url, imagen_public_id } = await uploadFromUrl(imageUrl, nombre);

      const { rowCount } = await client.query(
        `UPDATE producto
            SET imagen_url = $1, imagen_public_id = $2
          WHERE nombre = $3`,
        [imagen_url, imagen_public_id, nombre]
      );

      console.log(rowCount > 0 ? `✅  OK` : `⚠️  No encontrado en BD (imagen subida igual)`);

      ok.push({ nombre, imagen_url, imagen_public_id });

      // SQL para seed futuro (nombre es PK natural única)
      const esc = (s) => s.replace(/'/g, "''");
      sqlLines.push(
        `UPDATE producto SET imagen_url = '${esc(imagen_url)}', imagen_public_id = '${esc(imagen_public_id)}' WHERE nombre = '${esc(nombre)}';`
      );
    } catch (err) {
      console.log(`❌  ${err.message}`);
      failed.push({ nombre, error: err.message });
    }
  }

  await client.end();

  // ── Escribir archivo SQL patch ──────────────────────────────────────────────
  const patchPath = path.resolve(__dirname, '../../db/init/sql/seed_product_images.sql');
  fs.writeFileSync(patchPath, sqlLines.join('\n') + '\n', 'utf8');

  // ── Resumen ─────────────────────────────────────────────────────────────────
  console.log('\n──────────────────────────────────────────────────────────────');
  console.log(`✅  Exitosos : ${ok.length}`);
  console.log(`❌  Fallidos : ${failed.length}`);
  console.log(`📄  SQL patch: ${patchPath}`);

  if (failed.length) {
    console.log('\nFallidos (puedes reemplazar la URL en PRODUCT_IMAGES y re-ejecutar):');
    failed.forEach(({ nombre, error }) => console.log(`   ${nombre}: ${error}`));
  }

  console.log('\n📌 Agrega esta línea en db/init/00_init.sql para que el seeding');
  console.log('   de Docker incluya las imágenes automáticamente:');
  console.log('   \\i /docker-entrypoint-initdb.d/sql/seed_product_images.sql\n');
}

main().catch((err) => {
  console.error('\n💥 Error fatal:', err.message);
  process.exit(1);
});
