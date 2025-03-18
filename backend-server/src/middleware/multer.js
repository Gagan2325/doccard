const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Destination folder
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
    limits: { fileSize: 2 * 1024 * 1024 }
});

// Initialize upload variable
const upload = multer({ storage: storage });

module.exports = { multerFileupload: upload };