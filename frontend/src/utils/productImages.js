export const PRODUCT_IMAGE_MAX_BYTES = 4 * 1024 * 1024;

const ACCEPTED_PRODUCT_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export function validateProductImageFile(file) {
  if (!file) {
    return 'Selecciona una imagen válida.';
  }

  if (!ACCEPTED_PRODUCT_IMAGE_TYPES.has(file.type)) {
    return 'La imagen debe ser PNG, JPG, WEBP o GIF.';
  }

  if (file.size > PRODUCT_IMAGE_MAX_BYTES) {
    return 'La imagen supera el máximo permitido de 4 MB.';
  }

  return '';
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada.'));

    reader.readAsDataURL(file);
  });
}
