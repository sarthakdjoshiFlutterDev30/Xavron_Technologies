const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = './uploads';
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error('Only pdf/doc/docx allowed'));
  }
});

const uploadToCloudinary = async (filePath) => {
  const fileName = path.basename(filePath);
  const ext = path.extname(fileName).toLowerCase();

  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: 'raw',
    public_id: `resumes/${fileName.split('.')[0]}`,
    format: ext.replace('.', ''),
    type: 'upload',
    secure: true,
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    invalidate: true
  });

  return {
    id: result.public_id,
    webContentLink: result.secure_url,
    webViewLink: result.secure_url,
    consoleUrl: `https://console.cloudinary.com/app/c-ff4e3aba86638595573ceda3d68465/assets/media_library/search/asset/${result.asset_id}/manage/summary`
  };
};

module.exports = { upload, uploadToCloudinary };

