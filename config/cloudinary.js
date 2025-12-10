const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "dtgms7yog",
  api_key: process.env.CLOUD_API_KEY || "524251772772498",
  api_secret: process.env.CLOUD_API_SECRET || "EcNSWVkoFc5Hyt1HD9yKY0AKupI"
});

module.exports = cloudinary;

