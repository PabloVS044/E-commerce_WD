const { AppError } = require('../utils/appError');
const { getCloudinaryConfig, hasCloudinaryConfig } = require('../config/cloudinary');

const ACCEPTED_IMAGE_PATTERN = /^data:image\/(png|jpe?g|webp|gif);base64,/i;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function slugifySegment(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function estimateDataUrlSizeBytes(dataUrl) {
  const base64Data = String(dataUrl || '').split(',')[1] || '';
  const padding = base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0;
  return Math.max(0, (base64Data.length * 3) / 4 - padding);
}

function assertValidProductImageDataUrl(dataUrl) {
  if (!ACCEPTED_IMAGE_PATTERN.test(String(dataUrl || ''))) {
    throw new AppError(400, 'La imagen debe ser PNG, JPG, WEBP o GIF.');
  }

  if (estimateDataUrlSizeBytes(dataUrl) > MAX_IMAGE_BYTES) {
    throw new AppError(400, 'La imagen supera el máximo permitido de 4 MB.');
  }
}

function buildBasicAuthHeader(config) {
  return `Basic ${Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString('base64')}`;
}

async function parseCloudinaryResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

async function callCloudinary(action, formData) {
  const config = getCloudinaryConfig();
  const endpoint = `${config.uploadPrefix}/v1_1/${config.cloudName}/image/${action}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: buildBasicAuthHeader(config),
    },
    body: formData,
  });

  const data = await parseCloudinaryResponse(response);
  if (!response.ok) {
    throw new AppError(502, data?.error?.message || 'Cloudinary rechazó la operación de imagen.');
  }

  return data;
}

async function uploadProductImage(dataUrl, { productName } = {}) {
  if (!dataUrl) {
    return null;
  }

  if (!hasCloudinaryConfig()) {
    throw new AppError(500, 'Configura Cloudinary en el backend antes de subir imágenes.');
  }

  assertValidProductImageDataUrl(dataUrl);

  const config = getCloudinaryConfig();
  const formData = new FormData();
  formData.append('file', dataUrl);
  formData.append('folder', config.folder);
  formData.append('public_id', `${slugifySegment(productName) || 'producto'}-${Date.now()}`);
  formData.append('overwrite', 'false');

  const result = await callCloudinary('upload', formData);
  return {
    imagen_url: result.secure_url || result.url || null,
    imagen_public_id: result.public_id || null,
  };
}

async function deleteProductImage(publicId) {
  if (!publicId || !hasCloudinaryConfig()) {
    return false;
  }

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('invalidate', 'true');

  const result = await callCloudinary('destroy', formData);
  return result.result === 'ok' || result.result === 'not found';
}

async function safeDeleteProductImage(publicId) {
  try {
    return await deleteProductImage(publicId);
  } catch (error) {
    console.error(`No se pudo limpiar la imagen ${publicId} en Cloudinary: ${error.message}`);
    return false;
  }
}

module.exports = {
  MAX_IMAGE_BYTES,
  assertValidProductImageDataUrl,
  safeDeleteProductImage,
  uploadProductImage,
};
