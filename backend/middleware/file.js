const multer = require("multer");

const MIME_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPES[file.mimetype];
    let error = new Error("El tipo de archivo no es valido");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/files");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPES[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

module.exports = multer({ storage: storage }).single("image");
