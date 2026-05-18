function normalizeCloudinaryUploadPrefix(value) {
  const trimmed = String(value || 'https://api.cloudinary.com').trim();
  return trimmed.replace(/\/+$/, '') || 'https://api.cloudinary.com';
}

function getCloudinaryConfig() {
  return {
    cloudName: String(process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
    apiKey: String(process.env.CLOUDINARY_API_KEY || '').trim(),
    apiSecret: String(process.env.CLOUDINARY_API_SECRET || '').trim(),
    folder: String(process.env.CLOUDINARY_PRODUCT_FOLDER || 'tacos-el-pepe/productos').trim(),
    uploadPrefix: normalizeCloudinaryUploadPrefix(process.env.CLOUDINARY_UPLOAD_PREFIX),
  };
}

function hasCloudinaryConfig() {
  const config = getCloudinaryConfig();
  return Boolean(config.cloudName && config.apiKey && config.apiSecret);
}

module.exports = {
  getCloudinaryConfig,
  hasCloudinaryConfig,
  normalizeCloudinaryUploadPrefix,
};
