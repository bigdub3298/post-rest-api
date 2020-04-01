const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const acceptedFileTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (acceptedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

exports.config = () => {
  return multer({ storage: storage, fileFilter: fileFilter }).single("image");
};
