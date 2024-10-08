const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const diskMountPath = "/var/data";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, diskMountPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
